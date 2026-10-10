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

        $query = User::latest()->with(['role.devision', 'roles.devision']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($perPage)->withQueryString();

        $users->getCollection()->transform(function($user) {
            $user->permissions_count = $user->role ? $user->role->permissions->count() : 0;
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
        $user->load(['role.devision', 'roles.devision']);
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
        // 1. Validasi input (multi-role)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
            'password' => 'required|string|min:8',
        ]);

        // 2. Simpan ke database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        // 3. Simpan multi-role ke pivot user_roles
        $this->syncRoles($user, $request->role_ids);

        // 3. Redirect kembali ke halaman index
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $user->load(['role', 'roles']);
        $roles = Role::all();
        return inertia('Dashboard/Users/Edit', 
            ['user' => $user, 'roles' => $roles]
        );
    }

    public function update(Request $request, User $user)
    {
        // 1. Validasi input (multi-role)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'required|string|max:20',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
            'is_active' => 'required|in:0,1',
            'password' => 'nullable|string|min:8',
        ]);

        // 2. Update data di database
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->is_active = $request->is_active;
        // Hanya update password jika field password tidak kosong
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // 3. Sinkronkan multi-role ke pivot user_roles
        $this->syncRoles($user, $request->role_ids);

        // 4. Redirect kembali ke halaman index
        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    /**
     * Sinkronkan daftar role user ke pivot user_roles.
     * Role pertama pada input dijadikan role primary.
     */
    protected function syncRoles(User $user, array $roleIds): void
    {
        $roleIds = array_values(array_unique($roleIds));
        $primary = $roleIds[0] ?? null;

        $sync = collect($roleIds)->mapWithKeys(function ($id) use ($primary) {
            return [$id => ['is_primary' => ((string) $id === (string) $primary)]];
        })->all();

        $user->roles()->sync($sync);
    }
}
