<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = User::latest()->with('role.devision');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($perPage)->withQueryString();

        $users->getCollection()->transform(function($user) {
            $role = $user->role;
            $user->permissions_count = $role->permissions->count();
            return $user;
        });

        return inertia('Dashboard/Users/Index', 
            [
                'users' => $users,
                'filters' => [
                    'search' => $search,
                    'per_page' => $perPage,
                ]
            ]
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
            'phone' => 'required|string|max:20',
            'role_id' => 'required|exists:roles,id',
            'password' => 'required|string|min:8',
        ]);

        // 2. Simpan ke database
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
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
            'phone' => 'required|string|max:20',
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'required|in:0,1',
            'password' => 'nullable|string|min:8',
        ]);

        // 2. Update data di database
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->role_id = $request->role_id;
        $user->is_active = $request->is_active;
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
