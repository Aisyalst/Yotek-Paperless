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
        $company = $request->query('company');
        $department = $request->query('department');
        $positionId = $request->query('employee_position_id');
        $rankId = $request->query('employee_rank_id');
        $status = $request->query('employment_status');

        $query = EmployeeInformation::with([
            'user',
            'personalInformation',
            'supervisor',
            'employeeRank',
            'employeePosition',
            'employments.employeePosition',
            'employments.employeeRank',
        ])->latest();

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        // Perusahaan / departemen: cocokkan lewat penempatan utama MAUPUN
        // penempatan tambahan (employee_employments) agar karyawan
        // multi-perusahaan tetap muncul.
        if ($company) {
            $query->where(function ($q) use ($company) {
                $q->where('company', $company)
                  ->orWhereHas('employments', fn ($e) => $e->where('company', $company));
            });
        }

        if ($department) {
            $query->where(function ($q) use ($department) {
                $q->where('department', $department)
                  ->orWhereHas('employments', fn ($e) => $e->where('department', $department));
            });
        }

        if ($positionId) {
            $query->where(function ($q) use ($positionId) {
                $q->where('employee_position_id', $positionId)
                  ->orWhereHas('employments', fn ($e) => $e->where('employee_position_id', $positionId));
            });
        }

        if ($rankId) {
            $query->where(function ($q) use ($rankId) {
                $q->where('employee_rank_id', $rankId)
                  ->orWhereHas('employments', fn ($e) => $e->where('employee_rank_id', $rankId));
            });
        }

        if ($status) {
            $query->where(function ($q) use ($status) {
                $q->where('employment_status', $status)
                  ->orWhereHas('employments', fn ($e) => $e->where('employment_status', $status));
            });
        }

        $employees = $query->paginate($perPage)->withQueryString();

        return inertia('Dashboard/EmployeeRegistration/Index', [
            'employees' => $employees,
            'filterOptions' => [
                'companies' => \App\Models\Company::orderBy('name')->pluck('name'),
                'departments' => EmployeeInformation::query()->whereNotNull('department')->distinct()->orderBy('department')->pluck('department'),
                'positions' => \App\Models\EmployeePosition::orderBy('order')->get(['id', 'name']),
                'ranks' => \App\Models\EmployeeRank::orderBy('order')->get(['id', 'title']),
                'statuses' => EmployeeInformation::query()->whereNotNull('employment_status')->distinct()->orderBy('employment_status')->pluck('employment_status'),
            ],
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'company' => $company,
                'department' => $department,
                'employee_position_id' => $positionId,
                'employee_rank_id' => $rankId,
                'employment_status' => $status,
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
            'employments' => 'required|array|min:1',
            'employments.*.company' => 'required|string|max:255',
            'employments.*.branch' => 'nullable|string|max:255',
            'employments.*.department' => 'nullable|string|max:255',
            'employments.*.employee_position_id' => 'nullable|exists:employee_positions,id',
            'employments.*.employee_rank_id' => 'nullable|exists:employee_ranks,id',
            'employments.*.direct_supervisor' => 'nullable|string|max:255',
            'employments.*.employment_status' => 'nullable|string|max:255',
            'employments.*.join_date' => 'nullable|date',
        ], [
            'user_id.required' => 'Pengguna wajib dipilih.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.unique' => 'NIK ini sudah digunakan.',
            'employments.required' => 'Minimal satu penempatan perusahaan wajib diisi.',
            'employments.*.company.required' => 'Perusahaan wajib dipilih pada setiap penempatan.',
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

        // 2. Normalisasi + dedupe baris penempatan (multi-perusahaan & multi-jabatan)
        $employments = $this->normalizeEmployments($request->input('employments', []));
        $primary = $employments[0] ?? [];

        // 3. Simpan informasi karyawan (kolom = penempatan utama, backward-compatible)
        EmployeeInformation::create([
            'nik' => $request->nik,
            'company' => $primary['company'] ?? null,
            'branch' => $primary['branch'] ?? null,
            'department' => $primary['department'] ?? null,
            'employee_position_id' => $primary['employee_position_id'] ?? null,
            'employee_rank_id' => $primary['employee_rank_id'] ?? null,
            'direct_supervisor' => $primary['direct_supervisor'] ?? null,
            'employment_status' => $primary['employment_status'] ?? null,
            'join_date' => $primary['join_date'] ?? null,
        ]);

        // 4. Simpan tiap penempatan ke employee_employments
        $this->syncEmployments($request->nik, $employments);

        return redirect()->route('employee-registrations.index')->with('success', 'Registrasi karyawan berhasil dibuat.');
    }

    public function edit(EmployeeInformation $employeeRegistration)
    {
        $employeeRegistration->load([
            'user',
            'personalInformation',
            'employeeRank',
            'employeePosition',
            'employments.employeePosition',
            'employments.employeeRank',
        ]);
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
            'employments' => 'required|array|min:1',
            'employments.*.company' => 'required|string|max:255',
            'employments.*.branch' => 'nullable|string|max:255',
            'employments.*.department' => 'nullable|string|max:255',
            'employments.*.employee_position_id' => 'nullable|exists:employee_positions,id',
            'employments.*.employee_rank_id' => 'nullable|exists:employee_ranks,id',
            'employments.*.direct_supervisor' => 'nullable|string|max:255',
            'employments.*.employment_status' => 'nullable|string|max:255',
            'employments.*.join_date' => 'nullable|date',
        ], [
            'employments.required' => 'Minimal satu penempatan perusahaan wajib diisi.',
            'employments.*.company.required' => 'Perusahaan wajib dipilih pada setiap penempatan.',
        ]);

        // Normalisasi + dedupe baris penempatan (baris pertama = utama)
        $employments = $this->normalizeEmployments($request->input('employments', []));
        $primary = $employments[0] ?? [];

        $employeeRegistration->update([
            'company' => $primary['company'] ?? null,
            'branch' => $primary['branch'] ?? null,
            'department' => $primary['department'] ?? null,
            'employee_position_id' => $primary['employee_position_id'] ?? null,
            'employee_rank_id' => $primary['employee_rank_id'] ?? null,
            'direct_supervisor' => $primary['direct_supervisor'] ?? null,
            'employment_status' => $primary['employment_status'] ?? null,
            'join_date' => $primary['join_date'] ?? null,
        ]);

        // Sync penempatan multi-perusahaan / multi-jabatan
        $this->syncEmployments($employeeRegistration->nik, $employments);

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
     * Normalisasi baris penempatan dari form repeater.
     * - buang baris tanpa perusahaan
     * - rapikan nilai kosong menjadi null
     * - DEDUPE kombinasi (company, department, employee_position_id) agar tidak
     *   melanggar unique constraint employee_employments.
     *
     * @param  array<int, array<string, mixed>>  $rows
     * @return array<int, array<string, mixed>>
     */
    protected function normalizeEmployments(array $rows): array
    {
        $result = [];
        $seen = [];

        foreach ($rows as $row) {
            if (!is_array($row)) {
                continue;
            }

            $company = isset($row['company']) ? trim((string) $row['company']) : '';
            if ($company === '') {
                continue;
            }

            $department = $this->nullIfEmpty($row['department'] ?? null);
            $positionId = $this->nullIfEmpty($row['employee_position_id'] ?? null);

            // Kunci dedupe persis sama dengan unique index di DB.
            $key = strtolower($company) . '|' . strtolower((string) $department) . '|' . (string) $positionId;
            if (isset($seen[$key])) {
                continue;
            }
            $seen[$key] = true;

            $result[] = [
                'company' => $company,
                'branch' => $this->nullIfEmpty($row['branch'] ?? null),
                'department' => $department,
                'employee_position_id' => $positionId,
                'employee_rank_id' => $this->nullIfEmpty($row['employee_rank_id'] ?? null),
                'direct_supervisor' => $this->nullIfEmpty($row['direct_supervisor'] ?? null),
                'employment_status' => $this->nullIfEmpty($row['employment_status'] ?? null),
                'join_date' => $this->nullIfEmpty($row['join_date'] ?? null),
            ];
        }

        return $result;
    }

    /**
     * Ubah string kosong menjadi null (biar kolom nullable bersih).
     */
    protected function nullIfEmpty(mixed $value): mixed
    {
        if ($value === null) {
            return null;
        }

        if (is_string($value)) {
            $value = trim($value);
            return $value === '' ? null : $value;
        }

        return $value;
    }

    /**
     * Tulis ulang penempatan karyawan di employee_employments.
     * Baris pertama = penempatan utama (is_primary = true).
     *
     * @param  array<int, array<string, mixed>>  $employments
     */
    protected function syncEmployments(string $nik, array $employments): void
    {
        // Tulis ulang agar konsisten dengan pilihan terbaru (menghindari bentrok unique).
        EmployeeEmployment::where('nik', $nik)->delete();

        foreach ($employments as $index => $row) {
            EmployeeEmployment::create([
                'nik' => $nik,
                'company' => $row['company'],
                'branch' => $row['branch'] ?? null,
                'department' => $row['department'] ?? null,
                'employee_position_id' => $row['employee_position_id'] ?? null,
                'employee_rank_id' => $row['employee_rank_id'] ?? null,
                'direct_supervisor' => $row['direct_supervisor'] ?? null,
                'employment_status' => $row['employment_status'] ?? null,
                'is_primary' => $index === 0,
                'join_date' => $row['join_date'] ?? null,
            ]);
        }
    }
}
