<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmployeeInformation;
use App\Models\User;

class EmployeeRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = EmployeeInformation::with(['user', 'supervisor'])->latest();

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $employees = $query->paginate($perPage)->withQueryString();

        return inertia('Dashboard/EmployeeRegistration/Index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ]
        ]);
    }

    public function create()
    {
        // Users who don't have an NIK yet
        $users = User::whereNull('nik')->get(['id', 'name']);
        $allUsers = User::all(['nik', 'name']);
        
        return inertia('Dashboard/EmployeeRegistration/Create', [
            'users' => $users,
            'allUsers' => $allUsers
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'nik' => 'required|string|unique:users,nik|unique:employee_information,nik',
            'company' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:255',
            'direct_supervisor' => 'nullable|string|max:255',
            'employment_status' => 'nullable|string|max:255',
            'join_date' => 'nullable|date',
            'effective_date' => 'nullable|date',
        ], [
            'user_id.required' => 'Pengguna wajib dipilih.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.unique' => 'NIK ini sudah digunakan.',
        ]);

        // 1. Update NIK di tabel users
        $user = User::findOrFail($request->user_id);
        $user->nik = $request->nik;
        $user->save();

        // 2. Simpan informasi karyawan
        $employeeData = $request->except('user_id');
        EmployeeInformation::create($employeeData);

        return redirect()->route('employee-registrations.index')->with('success', 'Registrasi karyawan berhasil dibuat.');
    }

    public function edit(EmployeeInformation $employeeRegistration)
    {
        $employeeRegistration->load('user');
        $users = User::where('nik', $employeeRegistration->nik)->get(['nik', 'name']);
        $allUsers = User::all(['nik', 'name']);

        return inertia('Dashboard/EmployeeRegistration/Edit', [
            'employee' => $employeeRegistration,
            'users' => $users,
            'allUsers' => $allUsers
        ]);
    }

    public function update(Request $request, EmployeeInformation $employeeRegistration)
    {
        $request->validate([
            'company' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:255',
            'direct_supervisor' => 'nullable|string|max:255',
            'employment_status' => 'nullable|string|max:255',
            'join_date' => 'nullable|date',
            'effective_date' => 'nullable|date',
        ]);

        $employeeRegistration->update($request->except('nik'));

        return redirect()->route('employee-registrations.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(EmployeeInformation $employeeRegistration)
    {
        $employeeRegistration->delete();
        return redirect()->back()->with('success', 'Data karyawan berhasil dihapus.');
    }
}
