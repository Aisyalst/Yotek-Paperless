<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\EmployeeInformation;
use App\Models\EmployeeRank;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $roles = Role::with('devision')->get();
        $baseNik = 2026001;
        $staffRank = EmployeeRank::where('title', 'Associate')->first();
        $managerRank = EmployeeRank::where('title', 'Manager')->first();

        foreach ($roles as $role) {
            $nik = strval($baseNik++);
            $emailPrefix = strtolower(str_replace(' ', '', $role->name));
            $user = User::updateOrCreate(
                ['email' => $emailPrefix . '@yotek.com'],
                [
                    'name' => $role->name . ' User',
                    'nik' => $nik,
                    'role_id' => $role->id,
                    'password' => Hash::make('123123123'),
                ]
            );

            EmployeeInformation::updateOrCreate(
                ['nik' => $user->nik],
                [
                    'company' => 'Yotek',
                    'branch' => 'Tangerang',
                    'department' => $role->devision ? $role->devision->name : 'General',
                    'employee_rank_id' => $staffRank ? $staffRank->id : null,
                    'employment_status' => 'Permanent',
                    'join_date' => Carbon::now()->subYears(1),
                    'effective_date' => Carbon::now()->subYears(1),
                ]
            );
        }

        // Custom User for Aisyal
        $aisyalNik = strval($baseNik++);
        $webDevRole = collect($roles)->where('name', 'Web Dev')->first();
        
        $aisyal = User::updateOrCreate(
            ['email' => 'workeealaisyaln@gmail.com'],
            [
                'name' => 'Aisyal',
                'nik' => $aisyalNik,
                'role_id' => $webDevRole ? $webDevRole->id : null,
                'password' => Hash::make('123123123'),
            ]
        );

        EmployeeInformation::updateOrCreate(
            ['nik' => $aisyal->nik],
            [
                'company' => 'Yotek',
                'branch' => 'Pekanbaru',
                'department' => 'Digital Support',
                'employee_rank_id' => $managerRank ? $managerRank->id : null,
                'employment_status' => 'Permanent',
                'join_date' => Carbon::now()->subYears(2),
                'effective_date' => Carbon::now()->subYears(2),
            ]
        );

        // Assign Division Heads
        $headFinanceUser = User::whereHas('role', function ($query) {
            $query->where('name', 'Head Finance');
        })->first();

        $headHRUser = User::whereHas('role', function ($query) {
            $query->where('name', 'Head HR');
        })->first();

        if ($headFinanceUser) {
            \App\Models\Devision::where('name', 'Digital Support')->update(['head' => $headFinanceUser->nik]);
            \App\Models\Devision::where('name', 'Finance')->update(['head' => $headFinanceUser->nik]);
        }

        if ($headHRUser) {
            \App\Models\Devision::where('name', 'HR')->update(['head' => $headHRUser->nik]);
        }
    }
}
