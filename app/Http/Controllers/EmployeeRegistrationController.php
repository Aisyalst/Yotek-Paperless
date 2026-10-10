<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmployeeInformation;
use App\Models\EmployeeEmployment;
use App\Models\User;

class EmployeeRegistrationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = EmployeeInformation::with(['user', 'personalInformation', 'supervisor', 'employeeRank', 'employeePosition', 'employments'])->latest();

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
        $users = User::with(['role.devision', 'roles'])->whereNull('nik')->get(['id', 'name']);
        $allUsers = User::all(['nik', 'name']);
        $companies = \App\Models\Company::all(['id', 'name', 'branch']);
        $ranks = \App\Models\EmployeeRank::orderBy('order')->get(['id', 'title']);
        $positions = \App\Models\EmployeePosition::orderBy('order')->get(['id', 'name']);
        
        return inertia('Dashboard/EmployeeRegistration/Create', [
            'users' => $users,
            'allUsers' => $allUsers,
            'companies' => $companies,
            'ranks' => $ranks,
            'positions' => $positions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'nik' => 'required|string|unique:users,nik|unique:employee_information,nik',
            'company' => 'nullable|array',
            'company.*' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'employee_position_id' => 'nullable|exists:employee_positions,id',
            'employee_rank_id' => 'nullable|exists:employee_ranks,id',
            'direct_supervisor' => 'nullable|string|max:255',
            'employment_status' => 'nullable|string|max:255',
            'join_date' => 'nullable|date',
        ], [
            'user_id.required' => 'Pengguna wajib dipilih.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.unique' => 'NIK ini sudah digunakan.',
        ]);

        // 1. Update NIK di tabel users
        $user = User::findOrFail($request->user_id);
        $user->nik = $request->nik;
        $user->save();

        // Sync NIK to personal_information if exists and is currently null
        if ($user->personalInformation && is_null($user->personalInformation->nik)) {
            $user->personalInformation->nik = $request->nik;
            $user->personalInformation->save();
        }

        // 2. Daftar perusahaan terpilih (multi-perusahaan). Perusahaan pertama = penempatan utama.
        $companies = $this->selectedCompanies($request);

        // 3. Simpan informasi karyawan (kolom company = perusahaan utama, backward-compatible)
        $employeeData = $request->except(['user_id', 'company']);
        $employeeData['company'] = $companies[0] ?? null;
        EmployeeInformation::create($employeeData);

        // 4. Simpan tiap penempatan perusahaan ke employee_employments
        $this->syncEmployments($request->nik, $companies, $request);

        return redirect()->route('employee-registrations.index')->with('success', 'Registrasi karyawan berhasil dibuat.');
    }

    public function edit(EmployeeInformation $employeeRegistration)
    {
        $employeeRegistration->load(['user', 'personalInformation', 'employeeRank', 'employeePosition', 'employments']);
        $users = User::where('nik', $employeeRegistration->nik)->get(['nik', 'name']);
        $allUsers = User::all(['nik', 'name']);
        $companies = \App\Models\Company::all(['id', 'name', 'branch']);
        $ranks = \App\Models\EmployeeRank::orderBy('order')->get(['id', 'title']);
        $positions = \App\Models\EmployeePosition::orderBy('order')->get(['id', 'name']);

        return inertia('Dashboard/EmployeeRegistration/Edit', [
            'employee' => $employeeRegistration,
            'users' => $users,
            'allUsers' => $allUsers,
            'companies' => $companies,
            'ranks' => $ranks,
            'positions' => $positions
        ]);
    }

    public function update(Request $request, EmployeeInformation $employeeRegistration)
    {
        $request->validate([
            'company' => 'nullable|array',
            'company.*' => 'nullable|string|max:255',
            'branch' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'employee_position_id' => 'nullable|exists:employee_positions,id',
            'employee_rank_id' => 'nullable|exists:employee_ranks,id',
            'direct_supervisor' => 'nullable|string|max:255',
            'employment_status' => 'nullable|string|max:255',
            'join_date' => 'nullable|date',
        ]);

        // Daftar perusahaan terpilih (perusahaan pertama = utama)
        $companies = $this->selectedCompanies($request);

        $employeeRegistration->update(array_merge(
            $request->except(['nik', 'company', 'employee_name']),
            ['company' => $companies[0] ?? null]
        ));

        // Sync penempatan multi-perusahaan
        $this->syncEmployments($employeeRegistration->nik, $companies, $request);

        return redirect()->route('employee-registrations.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(EmployeeInformation $employeeRegistration)
    {
        // employee_employments FK-nya ke users (bukan employee_information),
        // jadi hapus manual agar tidak menyisakan baris yatim.
        EmployeeEmployment::where('nik', $employeeRegistration->nik)->delete();

        $employeeRegistration->delete();
        return redirect()->back()->with('success', 'Data karyawan berhasil dihapus.');
    }

    /**
     * Ambil daftar perusahaan terpilih (bersih dari nilai kosong, unik, urut).
     *
     * @return array<int, string>
     */
    protected function selectedCompanies(Request $request): array
    {
        $companies = $request->input('company', []);

        if (!is_array($companies)) {
            $companies = $companies ? [$companies] : [];
        }

        $companies = array_filter($companies, fn ($c) => is_string($c) && trim($c) !== '');

        return array_values(array_unique($companies));
    }

    /**
     * Tulis ulang penempatan karyawan di employee_employments.
     * Perusahaan pertama = penempatan utama (is_primary = true).
     * Kolom branch hanya diisi pada penempatan utama (mode simple multi-perusahaan).
     */
    protected function syncEmployments(string $nik, array $companies, Request $request): void
    {
        // Tulis ulang agar konsisten dengan pilihan terbaru (menghindari bentrok unique).
        EmployeeEmployment::where('nik', $nik)->delete();

        foreach ($companies as $index => $company) {
            EmployeeEmployment::create([
                'nik' => $nik,
                'company' => $company,
                'branch' => $index === 0 ? ($request->branch ?: null) : null,
                'department' => $request->department ?: null,
                'employee_position_id' => $request->employee_position_id ?: null,
                'employee_rank_id' => $request->employee_rank_id ?: null,
                'direct_supervisor' => $request->direct_supervisor ?: null,
                'employment_status' => $request->employment_status ?: null,
                'is_primary' => $index === 0,
                'join_date' => $request->join_date ?: null,
            ]);
        }
    }
}
