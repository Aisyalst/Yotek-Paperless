<?php

namespace App\Http\Controllers;

use App\Models\ApprovalWorkflow;
use Illuminate\Http\Request;

class ApprovalWorkflowController extends Controller
{
    public function index()
    {
        $workflows = ApprovalWorkflow::all();
        return \Inertia\Inertia::render('Dashboard/ApprovalWorkflow/Index', [
            'workflows' => $workflows
        ]);
    }

    public function create()
    {
        $roles = \App\Models\Role::all();
        return \Inertia\Inertia::render('Dashboard/ApprovalWorkflow/Create', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'workflow_type' => 'required|string',
            'title' => 'required|string|max:255',
            'role_id' => 'required|array',
        ], [
            'workflow_type.required' => 'Tipe workflow wajib diisi.',
            'title.required' => 'Judul wajib diisi.',
            'role_id.required' => 'Role wajib dipilih.',
            'role_id.array' => 'Format role tidak valid.',
        ]);

        ApprovalWorkflow::create($request->all());

        return redirect()->route('approval-workflows.index')->with('success', 'Workflow berhasil ditambahkan.');
    }

    public function edit(ApprovalWorkflow $approvalWorkflow)
    {
        $roles = \App\Models\Role::all();
        // Load steps sorted by level
        $approvalWorkflow->load(['steps' => function ($query) {
            $query->orderBy('approval_level', 'asc');
        }]);
        $users = \App\Models\User::all(); // to select approvers
        return \Inertia\Inertia::render('Dashboard/ApprovalWorkflow/Edit', [
            'approvalWorkflow' => $approvalWorkflow,
            'roles' => $roles,
            'users' => $users
        ]);
    }

    public function update(Request $request, ApprovalWorkflow $approvalWorkflow)
    {
        $request->validate([
            'workflow_type' => 'required|string',
            'title' => 'required|string|max:255',
            'role_id' => 'required|array',
        ], [
            'workflow_type.required' => 'Tipe workflow wajib diisi.',
            'title.required' => 'Judul wajib diisi.',
            'role_id.required' => 'Role wajib dipilih.',
            'role_id.array' => 'Format role tidak valid.',
        ]);

        $approvalWorkflow->update($request->all());

        return redirect()->route('approval-workflows.index')->with('success', 'Workflow berhasil diperbarui.');
    }

    public function destroy(ApprovalWorkflow $approvalWorkflow)
    {
        $approvalWorkflow->delete();
        return redirect()->route('approval-workflows.index')->with('success', 'Workflow berhasil dihapus.');
    }
}
