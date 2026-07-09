<?php

namespace App\Http\Controllers;

use App\Models\RolePermission;
use App\Models\Role;
use App\Models\Route;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RolePermissionController extends Controller
{
    public function index()
    {
        $roles = Role::orderBy('name')->get();
        $routes = Route::orderBy('name')->get();
        $rolePermissions = RolePermission::select('id', 'role_id', 'route_id')->get();

        return inertia('Dashboard/Setting/Permissions/Index', [
            'roles' => $roles,
            'routes' => $routes,
            'rolePermissions' => $rolePermissions
        ]);
    }

    public function create()
    {
        $roles = Role::orderBy('name')->get();
        $routes = Route::orderBy('name')->get();
        return inertia('Dashboard/Setting/Permissions/Create', [
            'roles' => $roles,
            'routes' => $routes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'route_id' => [
                'required',
                'exists:routes,id',
                Rule::unique('role_permissions')->where(function ($query) use ($request) {
                    return $query->where('role_id', $request->role_id);
                })
            ]
        ], [
            'route_id.unique' => 'This role already has permission for this route.',
        ]);

        RolePermission::create([
            'role_id' => $request->role_id,
            'route_id' => $request->route_id,
        ]);

        return redirect()->route('role-permissions.index')->with('success', 'Permission granted successfully.');
    }

    public function edit(RolePermission $rolePermission)
    {
        $roles = Role::orderBy('name')->get();
        $routes = Route::orderBy('name')->get();
        return inertia('Dashboard/Setting/Permissions/Edit', [
            'rolePermission' => $rolePermission,
            'roles' => $roles,
            'routes' => $routes
        ]);
    }

    public function update(Request $request, RolePermission $rolePermission)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'route_id' => [
                'required',
                'exists:routes,id',
                Rule::unique('role_permissions')->where(function ($query) use ($request) {
                    return $query->where('role_id', $request->role_id);
                })->ignore($rolePermission->id)
            ]
        ], [
            'route_id.unique' => 'This role already has permission for this route.',
        ]);

        $rolePermission->update([
            'role_id' => $request->role_id,
            'route_id' => $request->route_id,
        ]);

        return redirect()->route('role-permissions.index')->with('success', 'Permission updated successfully.');
    }

    public function destroy(RolePermission $rolePermission)
    {
        $rolePermission->delete();
        return redirect()->route('role-permissions.index')->with('success', 'Permission revoked successfully.');
    }
}
