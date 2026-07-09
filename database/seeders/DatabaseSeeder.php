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
        $role = Role::create(['name' => 'Admin']);
        $role2 = Role::create(['name' => 'User']);

        User::create([
            'name' => 'Admin',
            'email' => 'test@example.com',
            'role_id' => $role->id,
            'password' => Hash::make('123'),
        ]);
        User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'role_id' => $role2->id,
            'password' => Hash::make('123'),
        ]);

        $this->call([
            RouteSettingSeeder::class,
            ]);

    }
}
