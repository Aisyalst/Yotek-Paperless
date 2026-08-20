<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Devision;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with(['permissions', 'users', 'devision'])->latest()->get();
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
        $devisions = Devision::orderBy('name')->get();
        return inertia('Dashboard/Setting/Roles/Create', ['devisions' => $devisions]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'devision_id' => 'nullable|exists:devisions,id',
        ], [
            'name.required' => 'Nama Role wajib diisi.',
            'name.string' => 'Nama Role harus berupa string.',
            'name.max' => 'Nama Role maksimal 255 karakter.',
            'name.unique' => 'Nama Role sudah digunakan.',
            'devision_id.exists' => 'Divisi tidak ditemukan.',
        ]);

        Role::create([
            'name' => $request->name,
            'devision_id' => $request->devision_id,
        ]);

        return redirect()->route('roles.index')->with('success', 'Role berhasil ditambahkan.');
    }

    public function edit(Role $role)
    {
        $devisions = Devision::orderBy('name')->get();
        return inertia('Dashboard/Setting/Roles/Edit', 
            ['role' => $role, 'devisions' => $devisions]
        );
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'devision_id' => 'nullable|exists:devisions,id',
        ], [
            'name.required' => 'Nama Role wajib diisi.',
            'name.string' => 'Nama Role harus berupa string.',
            'name.max' => 'Nama Role maksimal 255 karakter.',
            'name.unique' => 'Nama Role sudah digunakan.',
            'devision_id.exists' => 'Divisi tidak ditemukan.',
        ]);

        $role->update([
            'name' => $request->name,
            'devision_id' => $request->devision_id,
        ]);

        return redirect()->route('roles.index')->with('success', 'Role berhasil diperbarui.');
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role berhasil dihapus.');
    }
}
