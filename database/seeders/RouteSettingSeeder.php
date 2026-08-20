<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Route;
use App\Models\DashboardMenu;
use App\Models\RolePermission;

class RouteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $routes = [
            ['name' => 'Users', 'route_name' => 'users.index'], // 1
            ['name' => 'Roles', 'route_name' => 'roles.index'], // 3
            ['name' => 'Routes', 'route_name' => 'routes.index'], // 4
            ['name' => 'Routes Create', 'route_name' => 'routes.create'], // 5
            ['name' => 'Routes Store', 'route_name' => 'routes.store'], // 6
            ['name' => 'Routes Edit', 'route_name' => 'routes.edit'], // 7
            ['name' => 'Routes Update', 'route_name' => 'routes.update'], // 8
            ['name' => 'Permissions', 'route_name' => 'role-permissions.index'], // 9
            ['name' => 'Permissions Create', 'route_name' => 'role-permissions.create'], // 10
            ['name' => 'Permissions Store', 'route_name' => 'role-permissions.store'], // 11
            ['name' => 'Permissions Edit', 'route_name' => 'role-permissions.edit'], // 12
            ['name' => 'Permissions Update', 'route_name' => 'role-permissions.update'], // 13
            ['name' => 'Permissions Delete', 'route_name' => 'role-permissions.destroy'], // 14
            ['name' => 'Menu', 'route_name' => 'dashboard-menus.index'], // 15
            ['name' => 'Menu Create', 'route_name' => 'dashboard-menus.create'], // 16
            ['name' => 'Menu Store', 'route_name' => 'dashboard-menus.store'], // 17
            ['name' => 'Menu Edit', 'route_name' => 'dashboard-menus.edit'], // 18
            ['name' => 'Menu Update', 'route_name' => 'dashboard-menus.update'], // 19
            ['name' => 'Menu Delete', 'route_name' => 'dashboard-menus.destroy'], // 20
            ['name' => 'Users Create', 'route_name' => 'users.create'], // 16
            ['name' => 'Users Store', 'route_name' => 'users.store'], // 17
            ['name' => 'Users Edit', 'route_name' => 'users.edit'], // 18
            ['name' => 'Users Update', 'route_name' => 'users.update'], // 19
            ['name' => 'Users Delete', 'route_name' => 'users.destroy'], // 20
            ['name' => 'Roles Create', 'route_name' => 'roles.create'], // 16
            ['name' => 'Roles Store', 'route_name' => 'roles.store'], // 17
            ['name' => 'Roles Edit', 'route_name' => 'roles.edit'], // 18
            ['name' => 'Roles Update', 'route_name' => 'roles.update'], // 19
            ['name' => 'Roles Delete', 'route_name' => 'roles.destroy'], // 29
            ['name' => 'Menu Drag', 'route_name' => 'dashboard-menus.reorder'], // 30
            // Urgency Routes
            ['name' => 'Urgencies', 'route_name' => 'urgencies.index'], // 31
            ['name' => 'Urgencies Create', 'route_name' => 'urgencies.create'], // 32
            ['name' => 'Urgencies Store', 'route_name' => 'urgencies.store'], // 33
            ['name' => 'Urgencies Edit', 'route_name' => 'urgencies.edit'], // 34
            ['name' => 'Urgencies Update', 'route_name' => 'urgencies.update'], // 35
            ['name' => 'Urgencies Delete', 'route_name' => 'urgencies.destroy'], // 36
            // Status Routes
            ['name' => 'Statuses', 'route_name' => 'statuses.index'], // 37
            ['name' => 'Statuses Create', 'route_name' => 'statuses.create'], // 38
            ['name' => 'Statuses Store', 'route_name' => 'statuses.store'], // 39
            ['name' => 'Statuses Edit', 'route_name' => 'statuses.edit'], // 40
            ['name' => 'Statuses Update', 'route_name' => 'statuses.update'], // 41
            ['name' => 'Statuses Delete', 'route_name' => 'statuses.destroy'], // 42
            // Dashboard Menu Section Routes
            ['name' => 'Menu Sections', 'route_name' => 'dashboard-menu-sections.index'], // 43
            ['name' => 'Menu Sections Create', 'route_name' => 'dashboard-menu-sections.create'], // 44
            ['name' => 'Menu Sections Store', 'route_name' => 'dashboard-menu-sections.store'], // 45
            ['name' => 'Menu Sections Drag', 'route_name' => 'dashboard-menu-sections.reorder'], // 46
            ['name' => 'Menu Sections Edit', 'route_name' => 'dashboard-menu-sections.edit'], // 47
            ['name' => 'Menu Sections Update', 'route_name' => 'dashboard-menu-sections.update'], // 48
            ['name' => 'Menu Sections Delete', 'route_name' => 'dashboard-menu-sections.destroy'], // 49
        ];

        foreach ($routes as $route) {
            Route::create($route);
        }

        // First make sure we have the sections, or rely on DashboardMenuSectionSeeder being called first.
        // Assuming Tables is ID 1 and Settings is ID 2 if seeded in order. Let's just fetch them to be safe.
        $tablesSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Tables'], ['order' => 1]);
        $settingsSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Master Data'], ['order' => 2]);
        $masterDataSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Master Data'], ['order' => 3]);
        $settingsSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Settings'], ['order' => 4]);

        // 1. Tables Section
        DashboardMenu::create([
            'name' => 'Users',
            'icon' => 'HiUser',
            'route_id' => 1,
            'section_id' => $tablesSection->id,
            'type' => 'Single',
            'position' => 1,
        ]);

        // 2. Settings Section (Parent & Children)
        $settingsParent = DashboardMenu::create([
            'name' => 'Settings',
            'icon' => 'HiCog',
            'section_id' => $settingsSection->id,
            'type' => 'Dropdown',
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Roles',
            'icon' => 'HiShieldCheck',
            'route_id' => 2,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Routes',
            'icon' => 'HiLink',
            'route_id' => 3,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 2,
        ]);

        DashboardMenu::create([
            'name' => 'Permissions',
            'icon' => 'HiOutlineLogin',
            'route_id' => 8,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 3,
        ]);

        DashboardMenu::create([
            'name' => 'Menu',
            'icon' => 'HiMenuAlt2',
            'route_id' => 14,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 4,
        ]);

        DashboardMenu::create([
            'name' => 'Menu Sections',
            'icon' => 'HiViewGrid',
            'route_id' => 43,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 5,
        ]);

        // Master Data Section (Parent & Children)
        $masterDataParent = DashboardMenu::create([
            'name' => 'Master Data',
            'icon' => 'HiDatabase',
            'section_id' => $masterDataSection->id,
            'type' => 'Dropdown',
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Urgencies',
            'icon' => 'HiExclamation',
            'route_id' => 31, // Based on route index
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'parent_id' => $masterDataParent->id,
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Statuses',
            'icon' => 'HiAdjustments',
            'route_id' => 37, // Based on route index
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'parent_id' => $masterDataParent->id,
            'position' => 2,
        ]);

        // 3. Assign all routes to Admin role (id = 1)
        $adminRole = \App\Models\Role::first();
        if ($adminRole) {
            foreach (Route::all() as $route) {
                RolePermission::create([
                    'role_id' => $adminRole->id,
                    'route_id' => $route->id,
                ]);
            }
        }
    }
}
