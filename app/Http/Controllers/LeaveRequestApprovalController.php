<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequestApproval;
use App\Models\LeaveRequest;
use App\Models\LeaveEntitlement;
use App\Models\LeaveEntitlementUsage;
use App\Models\RolePermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaveRequestApprovalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        // Asumsi admin bisa melihat semua, user biasa hanya melihat approval miliknya
        // Di sini kita tampilkan semua yang berhubungan dengan NIK login
        $query = LeaveRequestApproval::with('leaveRequest.employee.user', 'approver');
        
        if ($user && $user->nik) {
            $query->where('approver_nik', $user->nik);
        }

        $approvals = $query->get()->map(function ($approval) {
            $is_my_turn = false;
            
            if ($approval->status === 'Pending') {
                $pendingPrevious = LeaveRequestApproval::where('leave_request_id', $approval->leave_request_id)
                    ->where('approver_level', '<', $approval->approver_level)
                    ->where('status', '!=', 'Approved')
                    ->exists();
                
                $is_my_turn = !$pendingPrevious;
            }
            
            $approval->setAttribute('is_my_turn', $is_my_turn);
            
            // Get total leave entitlements for the employee
            if ($approval->leaveRequest && $approval->leaveRequest->employee_nik) {
                $totalLeave = LeaveEntitlement::where('nik', $approval->leaveRequest->employee_nik)
                    ->where('status', 'Aktif')
                    ->sum('total');
                $approval->leaveRequest->setAttribute('total_active_leave', $totalLeave);
            }
            
            return $approval;
        });

        $userRole = $user ? $user->role_id : null;
        $canSetConsequence = false;
        
        if ($userRole) {
            $canSetConsequence = \App\Models\RolePermission::where('role_id', $userRole)
                ->whereHas('route', function ($query) {
                    $query->where('route_name', 'leave-request-approvals.set-consequence');
                })->exists();
        }

        return Inertia::render('Dashboard/LeaveRequestApproval/Index', [
            'approvals' => $approvals,
            'canSetConsequence' => $canSetConsequence
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequestApproval $leaveRequestApproval)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LeaveRequestApproval $leaveRequestApproval)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LeaveRequestApproval $leaveRequestApproval)
    {
        $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected',
            'signature' => 'required|string',
        ], [
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'signature.required' => 'Tanda tangan wajib diisi.',
            'signature.string' => 'Tanda tangan tidak valid.',
        ]);

        $leaveRequestApproval->update([
            'status' => $request->status,
            'signature' => $request->signature,
        ]);

        $leaveRequest = $leaveRequestApproval->leaveRequest;
        $employeeUser = $leaveRequest->employee ? $leaveRequest->employee->user : null;
        
        $userRole = Auth::user()->role_id;
        $canSetConsequence = \App\Models\RolePermission::where('role_id', $userRole)
            ->whereHas('route', function ($query) {
                $query->where('route_name', 'leave-request-approvals.set-consequence');
            })->exists();
        
        if ($canSetConsequence && $request->has('consequence') && $request->status === 'Approved') {
            $consequence = $request->consequence;
            $leaveRequest->update(['consequence' => $consequence]);
        }
        
        if ($request->status === 'Rejected') {
            $leaveRequest->update(['status' => 'Rejected']);
            
            LeaveRequestApproval::where('leave_request_id', $leaveRequest->id)
                ->where('approver_level', '>', $leaveRequestApproval->approver_level)
                ->update(['status' => 'Auto Reject']);

            if ($employeeUser) {
                app(\App\Services\NotificationService::class)->send([
                    'title' => 'Pengajuan Izin/Cuti Ditolak',
                    'body' => 'Pengajuan izin/cuti Anda telah ditolak oleh ' . Auth::user()->name . '.',
                    'type' => 'error',
                    'url' => route('leave-requests.show', $leaveRequest->id),
                    'target_type' => 'user',
                    'target_value' => (string) $employeeUser->id,
                    'created_by' => null,
                ]);
            }
        } elseif ($request->status === 'Approved') {
            $allApproved = !LeaveRequestApproval::where('leave_request_id', $leaveRequestApproval->leave_request_id)
                ->where('status', '!=', 'Approved')
                ->exists();
                
            if ($allApproved) {
                // Handle consequence deductions
                if ($leaveRequest->consequence) {
                    $requestedDays = (int) $leaveRequest->duration_days;
                    
                    if ($leaveRequest->consequence === 'Potong Cuti' || $leaveRequest->consequence === 'Potong Cuti dan Gaji') {
                        $activeEntitlements = LeaveEntitlement::where('nik', $leaveRequest->employee_nik)
                            ->where('status', 'Aktif')
                            ->where('total', '>', 0)
                            ->orderBy('end_date', 'asc')
                            ->get();
                            
                        $remainingDaysToDeduct = $requestedDays;
                        $totalDeductedLeave = 0;
                        
                        foreach ($activeEntitlements as $entitlement) {
                            if ($remainingDaysToDeduct <= 0) break;
                            
                            $deductFromThis = min($entitlement->total, $remainingDaysToDeduct);
                            $entitlement->update(['total' => $entitlement->total - $deductFromThis]);
                            
                            LeaveEntitlementUsage::create([
                                'leave_entitlement_id' => $entitlement->id,
                                'leave_request_id' => $leaveRequest->id,
                                'deducted_days' => $deductFromThis,
                                'reason' => 'Diproses otomatis melalui Persetujuan (Potong Cuti)'
                            ]);
                            
                            $remainingDaysToDeduct -= $deductFromThis;
                            $totalDeductedLeave += $deductFromThis;
                        }
                        
                        $deductedSalary = 0;
                        if ($leaveRequest->consequence === 'Potong Cuti dan Gaji' && $remainingDaysToDeduct > 0) {
                            $deductedSalary = $remainingDaysToDeduct;
                        } elseif ($leaveRequest->consequence === 'Potong Cuti dan Gaji' && $requestedDays > $totalDeductedLeave) {
                            // If user selected Potong Cuti dan Gaji and didn't have enough cuti, rest goes to salary
                             $deductedSalary = $requestedDays - $totalDeductedLeave;
                        }
                        
                        $leaveRequest->update([
                            'deducted_leave_days' => $totalDeductedLeave,
                            'deducted_salary_days' => $deductedSalary
                        ]);
                    } elseif ($leaveRequest->consequence === 'Potong Gaji') {
                        $leaveRequest->update([
                            'deducted_leave_days' => 0,
                            'deducted_salary_days' => $requestedDays
                        ]);
                    }
                }

                $leaveRequest->update(['status' => 'Approved']);

                if ($employeeUser) {
                    app(\App\Services\NotificationService::class)->send([
                        'title' => 'Pengajuan Izin/Cuti Disetujui',
                        'body' => 'Pengajuan izin/cuti Anda telah disetujui sepenuhnya.',
                        'type' => 'success',
                        'url' => route('leave-requests.show', $leaveRequest->id),
                        'target_type' => 'user',
                        'target_value' => (string) $employeeUser->id,
                        'created_by' => null,
                    ]);
                }
            } else {
                $nextApproval = LeaveRequestApproval::where('leave_request_id', $leaveRequestApproval->leave_request_id)
                    ->where('approver_level', '>', $leaveRequestApproval->approver_level)
                    ->orderBy('approver_level', 'asc')
                    ->first();

                if ($nextApproval && $nextApproval->approver_nik) {
                    $nextApproverUser = \App\Models\User::where('nik', $nextApproval->approver_nik)->first();
                    if ($nextApproverUser && $employeeUser) {
                        if ($nextApproverUser->id !== $employeeUser->id) {
                            app(\App\Services\NotificationService::class)->send([
                                'title' => 'Pengajuan Izin/Cuti Baru',
                                'body' => $employeeUser->name . ' mengajukan izin/cuti yang membutuhkan persetujuan Anda.',
                                'type' => 'info',
                                'url' => route('leave-request-approvals.index'),
                                'target_type' => 'user',
                                'target_value' => (string) $nextApproverUser->id,
                                'created_by' => null,
                            ]);
                        }
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Status approval berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveRequestApproval $leaveRequestApproval)
    {
        //
    }
}
