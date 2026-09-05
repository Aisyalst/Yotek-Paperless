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

    public function batchSync(Request $request)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id',
            'route_ids' => 'required|array',
            'route_ids.*' => 'exists:routes,id',
            'action' => 'required|in:grant,revoke'
        ]);

        if ($request->action === 'grant') {
            $existing = RolePermission::where('role_id', $request->role_id)
                ->whereIn('route_id', $request->route_ids)
                ->pluck('route_id')
                ->toArray();
            
            $toInsert = array_diff($request->route_ids, $existing);
            $insertData = array_map(function($routeId) use ($request) {
                return [
                    'role_id' => $request->role_id,
                    'route_id' => $routeId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $toInsert);
            
            RolePermission::insert($insertData);
        } else {
            RolePermission::where('role_id', $request->role_id)
                ->whereIn('route_id', $request->route_ids)
                ->delete();
        }

        return redirect()->back()->with('success', 'Permissions updated successfully.');
    }
}
