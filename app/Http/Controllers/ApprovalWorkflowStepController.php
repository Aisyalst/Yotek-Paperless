<?php

namespace App\Http\Controllers;

use App\Models\ApprovalWorkflowStep;
use App\Models\User;
use Illuminate\Http\Request;

class ApprovalWorkflowStepController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'approval_workflow_id' => 'required|exists:approval_workflows,id',
            'approval_level' => 'required|integer|min:1',
            'approver_type' => 'required|in:specific_user,division_head,creator',
            'approver_nik' => 'required_if:approver_type,specific_user',
        ], [
            'approval_workflow_id.required' => 'Workflow ID wajib diisi.',
            'approval_level.required' => 'Level approval wajib diisi.',
            'approval_level.integer' => 'Level approval harus berupa angka.',
            'approver_type.required' => 'Tipe approver wajib dipilih.',
            'approver_type.in' => 'Tipe approver tidak valid.',
            'approver_nik.required_if' => 'Approver wajib dipilih untuk tipe spesifik.',
        ]);

        $employeeRole = null;
        $approverNik = null;

        if ($request->approver_type === 'specific_user') {
            $user = User::with('role')->where('nik', $request->approver_nik)->first();
            $employeeRole = $user && $user->role ? $user->role->name : 'Unknown Role';
            $approverNik = $request->approver_nik;
        }

        ApprovalWorkflowStep::create([
            'approval_workflow_id' => $request->approval_workflow_id,
            'approval_level' => $request->approval_level,
            'approver_type' => $request->approver_type,
            'approver_nik' => $approverNik,
            'employee_role' => $employeeRole,
        ]);

        return redirect()->back()->with('success', 'Langkah approval berhasil ditambahkan.');
    }

    public function destroy(ApprovalWorkflowStep $step)
    {
        $step->delete();
        return redirect()->back()->with('success', 'Langkah approval berhasil dihapus.');
    }
}
