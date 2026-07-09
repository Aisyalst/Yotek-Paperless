<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->with('users')->latest()->get();
        $roles->each(function($role) {
            $role->permissions_count = $role->permissions->count();
            $role->users_count = $role->users->count();
        });
        return inertia('Dashboard/Setting/Roles/Index', 
            ['roles' => $roles]
        );
    }

    public function create()
    {
        return inertia('Dashboard/Setting/Roles/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        Role::create([
            'name' => $request->name,
        ]);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        return inertia('Dashboard/Setting/Roles/Edit', 
            ['role' => $role]
        );
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ]);

        $role->update([
            'name' => $request->name,
        ]);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
