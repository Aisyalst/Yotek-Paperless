<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Devision;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $rolesData = [
            // Role umum untuk SEMUA jabatan berawalan "Staff" (lintas departemen).
            'Staff' => null,
            'Web Dev' => 'Digital Support',
        ];

        foreach ($rolesData as $roleName => $devisionName) {
            $devision = $devisionName ? Devision::where('name', $devisionName)->first() : null;
            Role::firstOrCreate(
                ['name' => $roleName],
                ['devision_id' => $devision ? $devision->id : null]
            );
        }
    }
}
