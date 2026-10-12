<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Devision;
use App\Models\EmployeeEmployment;
use App\Models\EmployeeInformation;
use App\Models\EmployeePosition;
use App\Models\EmployeeRank;
use App\Models\PersonalInformation;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MainEmployeeData extends Seeder
{
    /**
     * Password default seluruh akun hasil seeder.
     */
    private const DEFAULT_PASSWORD = '123123123';

    /**
     * Seed master data (perusahaan / divisi / jabatan) + seluruh karyawan.
     *
     * Sumber data: database/seeders/data/employee_data.json — file terpisah
     * yang memuat PII (nama & NIK) dan TIDAK ikut ter-commit (lihat .gitignore).
     * Seeder ini idempotent: aman dijalankan berulang (updateOrCreate).
     */
    public function run(): void
    {
        $path = database_path('seeders/data/employee_data.json');

        if (! file_exists($path)) {
            $this->command?->warn("MainEmployeeData dilewati: {$path} tidak ditemukan.");
            return;
        }

        $data = json_decode((string) file_get_contents($path), true);

        if (! is_array($data) || empty($data['employees'])) {
            $this->command?->error('MainEmployeeData: employee_data.json kosong / tidak valid.');
            return;
        }

        $this->seedCompanies($data['companies'] ?? []);
        $this->seedDivisions($data['divisions'] ?? []);
        $this->seedPositions($data['positions'] ?? []);
        $this->seedEmployees($data['employees']);
    }

    /**
     * Perusahaan + daftar cabang (region / province / city).
     */
    private function seedCompanies(array $companies): void
    {
        foreach ($companies as $company) {
            Company::updateOrCreate(
                ['name' => $company['name']],
                ['branch' => $company['branches'] ?? []]
            );
        }
    }

    /**
     * Divisi / departemen.
     */
    private function seedDivisions(array $divisions): void
    {
        foreach ($divisions as $name) {
            Devision::firstOrCreate(['name' => $name]);
        }
    }

    /**
     * Jabatan (employee position).
     */
    private function seedPositions(array $positions): void
    {
        foreach ($positions as $index => $name) {
            EmployeePosition::firstOrCreate(
                ['name' => $name],
                ['order' => $index + 1]
            );
        }
    }

    /**
     * User + personal_information + penempatan kerja (multi-company / multi-jabatan).
     * Baris employment pertama tiap karyawan menjadi penempatan UTAMA (is_primary).
     */
    private function seedEmployees(array $employees): void
    {
        $positionIds = EmployeePosition::pluck('id', 'name');
        $defaultRankId = EmployeeRank::where('title', 'Associate')->value('id')
            ?? EmployeeRank::orderBy('order')->value('id');
        $joinDate = Carbon::now()->subYear();

        foreach ($employees as $employee) {
            $nik = (string) $employee['nik'];
            $name = $employee['name'];
            $email = $nik.'@yotek.com';

            $user = User::updateOrCreate(
                ['nik' => $nik],
                [
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make(self::DEFAULT_PASSWORD),
                ]
            );

            PersonalInformation::updateOrCreate(
                ['nik' => $nik],
                ['full_name' => $name, 'email' => $email]
            );

            $employments = $employee['employments'] ?? [];
            $primary = $employments[0] ?? null;

            foreach ($employments as $index => $employment) {
                $positionId = $positionIds[$employment['position']] ?? null;

                EmployeeEmployment::updateOrCreate(
                    [
                        'nik' => $nik,
                        'company' => $employment['company'],
                        'department' => $employment['department'],
                        'employee_position_id' => $positionId,
                    ],
                    [
                        'branch' => $employment['branch'],
                        'employee_rank_id' => $defaultRankId,
                        'employment_status' => 'Active',
                        'is_primary' => $index === 0,
                        'join_date' => $joinDate,
                    ]
                );
            }

            if ($primary) {
                EmployeeInformation::updateOrCreate(
                    ['nik' => $nik],
                    [
                        'company' => $primary['company'],
                        'branch' => $primary['branch'],
                        'department' => $primary['department'],
                        'employee_position_id' => $positionIds[$primary['position']] ?? null,
                        'employee_rank_id' => $defaultRankId,
                        'employment_status' => 'Active',
                        'join_date' => $joinDate,
                    ]
                );
            }

            $this->syncRoles($user, $employments);
        }
    }

    /**
     * Nama role dari sebuah penempatan.
     *
     * Semua jabatan yang berawalan "Staff" dinormalisasi menjadi SATU role
     * "Staff" (lintas departemen). Jabatan lain memakai pola
     * "{Jabatan} {Departemen}" (atau "{Jabatan}" bila sama dengan departemen).
     */
    private function roleNameFor(string $position, string $department): string
    {
        if (stripos($position, 'staff') === 0) {
            return 'Staff';
        }

        return strcasecmp($position, $department) === 0
            ? $position
            : trim($position.' '.$department);
    }

    /**
     * Role = hasil roleNameFor() (multi-role).
     * Role dari penempatan utama ditandai is_primary = true.
     */
    private function syncRoles(User $user, array $employments): void
    {
        if (empty($employments)) {
            return;
        }

        $sync = [];

        foreach ($employments as $index => $employment) {
            $position = trim($employment['position']);
            $department = trim($employment['department']);

            $roleName = $this->roleNameFor($position, $department);

            $role = Role::firstOrCreate(
                ['name' => $roleName],
                [
                    // Role "Staff" bersifat lintas departemen -> tanpa devisi.
                    'devision_id' => $roleName === 'Staff'
                        ? null
                        : Devision::where('name', $department)->value('id'),
                ]
            );

            // Jangan turunkan is_primary bila role ini sudah pernah jadi primary.
            $isPrimary = ($sync[$role->id]['is_primary'] ?? false) || $index === 0;
            $sync[$role->id] = ['is_primary' => $isPrimary];
        }

        $user->roles()->syncWithoutDetaching($sync);
    }
}
