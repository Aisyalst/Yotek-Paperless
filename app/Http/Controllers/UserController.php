<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->with('role')->get();
        $users->each(function($user) {
            $role = $user->role;
            $user->permissions_count = $role->permissions->count();
        });
        return inertia('Dashboard/Users/Index', 
            ['users' => $users]
        );
    }

    public function show(User $user)
    {
        $user->load('role');
        return inertia('Dashboard/Users/Show', 
            ['user' => $user]
        );
    }

    public function create()
    {
        $roles = Role::all();
        return inertia('Dashboard/Users/Create', ['roles' => $roles]);
    }

    // Memproses data form yang disubmit
    public function store(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role_id' => 'required|exists:roles,id',
            'password' => 'required|string|min:8',
        ]);

        // 2. Simpan ke database
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'password' => Hash::make($request->password),
        ]);

        // 3. Redirect kembali ke halaman index
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $user->load('role');
        $roles = Role::all();
        return inertia('Dashboard/Users/Edit', 
            ['user' => $user, 'roles' => $roles]
        );
    }

    public function update(Request $request, User $user)
    {
        // 1. Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|string|min:8',
        ]);

        // 2. Update data di database
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role_id = $request->role_id;
        // Hanya update password jika field password tidak kosong
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // 3. Redirect kembali ke halaman index
        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
