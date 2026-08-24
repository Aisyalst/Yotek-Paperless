<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Route;
use App\Models\RolePermission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $role = Role::create(['name' => 'Developers']);
        $role2 = Role::create(['name' => 'Administrators']);
        $role3 = Role::create(['name' => 'Staff']);

        User::create([
            'name' => 'Aisyal',
            'email' => 'workeealaisyaln@gmail.com',
            'role_id' => $role->id,
            'password' => Hash::make('123123123'),
        ]);
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'role_id' => $role2->id,
            'password' => Hash::make('123123123'),
        ]);
        User::create([
            'name' => 'Staff',
            'email' => 'staff@example.com',
            'role_id' => $role3->id,
            'password' => Hash::make('123123123'),
        ]);

        $this->call([
            RouteSettingSeeder::class,
        ]);

    }
}
