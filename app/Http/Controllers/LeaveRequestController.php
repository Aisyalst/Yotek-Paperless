<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        // For now, load all requests with their user data. 
        // In the future, this might be filtered by role (e.g. employee sees their own, HR sees all).
        $leaveRequests = LeaveRequest::with('employee.user')->orderBy('created_at', 'desc')->get();

        return Inertia::render('LeaveRequest/Index', [
            'leaveRequests' => $leaveRequests
        ]);
    }

    public function create(Request $request)
    {
        $user = clone $request->user();
        $user->load(['employeeInformation', 'role.devision']);

        if (!$user->nik || !$user->employeeInformation) {
            return redirect()->back()->with('error', 'Anda harus terdaftar sebagai karyawan dan memiliki NIK sebelum dapat mengajukan izin/cuti.');
        }

        return Inertia::render('LeaveRequest/Create', [
            'userData' => $user
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_type' => 'required|in:Sakit,Izin,Cuti,Cuti Khusus',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'duration_days' => 'nullable|integer|min:1',
            'has_doctor_note' => 'nullable|boolean',
            'permission_type' => 'nullable|string',
            'permission_start_time' => 'nullable|date_format:H:i',
            'permission_end_time' => 'nullable|date_format:H:i|after:permission_start_time',
            'deduction_type' => 'nullable|string|in:Potong Gaji,Potong Cuti',
            'special_leave_type' => 'nullable|string',
            'reason' => 'nullable|string',
            'work_delegation' => 'nullable|string',
        ], [
            'request_type.required' => 'Jenis pengajuan wajib diisi.',
            'request_type.in' => 'Jenis pengajuan tidak valid.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'end_date.date' => 'Format tanggal selesai tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'duration_days.integer' => 'Lama hari harus berupa angka.',
            'duration_days.min' => 'Lama hari minimal 1.',
            'permission_start_time.date_format' => 'Format jam mulai tidak valid (HH:MM).',
            'permission_end_time.date_format' => 'Format jam selesai tidak valid (HH:MM).',
            'permission_end_time.after' => 'Jam selesai harus setelah jam mulai.',
            'deduction_type.in' => 'Pilihan potong gaji/cuti tidak valid.'
        ]);

        $user = $request->user();
        if (!$user->nik) {
            return redirect()->back()->with('error', 'Informasi NIK tidak ditemukan.');
        }

        $validated['employee_nik'] = $user->nik;
        $validated['request_date'] = now()->toDateString();
        $validated['status'] = 'Pending';

        $leaveRequest = LeaveRequest::create($validated);

        // Auto-generate approvals based on workflow
        $user->load('role.devision');
        
        // Find matching workflow
        // Get all workflows of type 'Cuti' and check if role_id JSON contains the user's role_id
        $workflows = \App\Models\ApprovalWorkflow::where('workflow_type', 'Cuti')->get();
        $matchedWorkflow = null;
        
        foreach ($workflows as $wf) {
            $roleIds = is_array($wf->role_id) ? $wf->role_id : (json_decode($wf->role_id, true) ?? []);
            if (in_array((string)$user->role_id, $roleIds) || in_array($user->role_id, $roleIds)) {
                $matchedWorkflow = $wf;
                break;
            }
        }

        if ($matchedWorkflow) {
            $steps = \App\Models\ApprovalWorkflowStep::where('approval_workflow_id', $matchedWorkflow->id)
                ->orderBy('approval_level', 'asc')
                ->get();

            foreach ($steps as $step) {
                $approverNik = null;
                $approverRole = null;

                if ($step->approver_type === 'specific_user') {
                    $approverNik = $step->approver_nik;
                    $approverRole = $step->employee_role;
                } elseif ($step->approver_type === 'division_head') {
                    $devision = $user->role ? $user->role->devision : null;
                    if ($devision && $devision->head) {
                        $approverNik = $devision->head;
                        $headUser = \App\Models\User::with('role')->where('nik', $approverNik)->first();
                        $approverRole = $headUser && $headUser->role ? $headUser->role->name : 'Head of Division';
                    }
                }

                if ($approverNik) {
                    \App\Models\LeaveRequestApproval::create([
                        'leave_request_id' => $leaveRequest->id,
                        'approver_level' => $step->approval_level,
                        'approver_nik' => $approverNik,
                        'approver_role' => $approverRole,
                        'status' => 'Pending',
                    ]);
                }
            }

            // Notify the first approver
            $firstApproval = \App\Models\LeaveRequestApproval::where('leave_request_id', $leaveRequest->id)
                ->orderBy('approver_level', 'asc')
                ->first();

            if ($firstApproval && $firstApproval->approver_nik) {
                $approverUser = \App\Models\User::where('nik', $firstApproval->approver_nik)->first();
                if ($approverUser) {
                    app(\App\Services\NotificationService::class)->send([
                        'title' => 'Pengajuan Izin/Cuti Baru',
                        'body' => $user->name . ' mengajukan izin/cuti baru yang membutuhkan persetujuan Anda.',
                        'type' => 'info',
                        'url' => route('leave-request-approvals.index'),
                        'target_type' => 'user',
                        'target_value' => (string) $approverUser->id,
                        'created_by' => null,
                    ]);
                }
            }
        }

        return redirect()->route('leave-requests.index')->with('success', 'Pengajuan berhasil dikirim.');
    }

    public function show(Request $request, LeaveRequest $leaveRequest)
    {
        $leaveRequest->load(['employee.user.personalInformation', 'approvals.approver']);

        return Inertia::render('LeaveRequest/Show', [
            'leaveRequest' => $leaveRequest
        ]);
    }
}
