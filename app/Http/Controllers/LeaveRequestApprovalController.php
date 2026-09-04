<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequestApproval;
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

        $approvals = $query->get();

        return Inertia::render('Dashboard/LeaveRequestApproval/Index', [
            'approvals' => $approvals
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
        
        if ($request->status === 'Rejected') {
            $leaveRequest->update(['status' => 'Rejected']);
        } elseif ($request->status === 'Approved') {
            $allApproved = !LeaveRequestApproval::where('leave_request_id', $leaveRequestApproval->leave_request_id)
                ->where('status', '!=', 'Approved')
                ->exists();
                
            if ($allApproved) {
                $leaveRequest->update(['status' => 'Approved']);
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
