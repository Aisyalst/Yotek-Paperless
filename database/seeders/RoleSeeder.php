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
            'Web Dev' => 'Digital Support',
            'Head HR' => 'HR',
            'Head Finance' => 'Finance',
        ];

        foreach ($rolesData as $roleName => $devisionName) {
            $devision = Devision::where('name', $devisionName)->first();
            Role::firstOrCreate(
                ['name' => $roleName],
                ['devision_id' => $devision ? $devision->id : null]
            );
        }
    }
}
