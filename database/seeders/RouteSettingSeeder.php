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

            // Dashboard Menu Section Routes
            ['name' => 'Menu Sections', 'route_name' => 'dashboard-menu-sections.index'], // 43
            ['name' => 'Menu Sections Create', 'route_name' => 'dashboard-menu-sections.create'], // 44
            ['name' => 'Menu Sections Store', 'route_name' => 'dashboard-menu-sections.store'], // 45
            ['name' => 'Menu Sections Drag', 'route_name' => 'dashboard-menu-sections.reorder'], // 46
            ['name' => 'Menu Sections Edit', 'route_name' => 'dashboard-menu-sections.edit'], // 47
            ['name' => 'Menu Sections Update', 'route_name' => 'dashboard-menu-sections.update'], // 48
            ['name' => 'Menu Sections Delete', 'route_name' => 'dashboard-menu-sections.destroy'], // 49
            // Devision Routes
            ['name' => 'Devisions', 'route_name' => 'devisions.index'], // 50
            ['name' => 'Devisions Create', 'route_name' => 'devisions.create'], // 51
            ['name' => 'Devisions Store', 'route_name' => 'devisions.store'], // 52
            ['name' => 'Devisions Edit', 'route_name' => 'devisions.edit'], // 53
            ['name' => 'Devisions Update', 'route_name' => 'devisions.update'], // 54
            ['name' => 'Devisions Delete', 'route_name' => 'devisions.destroy'], // 55
            ['name' => 'Dashboard', 'route_name' => 'dashboard'],
            ['name' => 'Profile - Index', 'route_name' => 'profile.index'],
            ['name' => 'Leave Request Index', 'route_name' => 'leave-requests.index'],
            ['name' => 'Leave Request Create', 'route_name' => 'leave-requests.create'],
            ['name' => 'Leave Request Store', 'route_name' => 'leave-requests.store'],
            ['name' => 'Leave Request Show', 'route_name' => 'leave-requests.show'],
            ['name' => 'Employee Registrations Index', 'route_name' => 'employee-registrations.index'],
            ['name' => 'Employee Registrations Create', 'route_name' => 'employee-registrations.create'],
            ['name' => 'Employee Registrations Store', 'route_name' => 'employee-registrations.store'],
            ['name' => 'Employee Registrations Edit', 'route_name' => 'employee-registrations.edit'],
            ['name' => 'Employee Registrations Update', 'route_name' => 'employee-registrations.update'],
            ['name' => 'Employee Registrations Delete', 'route_name' => 'employee-registrations.destroy'],
            ['name' => 'Contracts Index', 'route_name' => 'contracts.index'],
            ['name' => 'Contracts Create', 'route_name' => 'contracts.create'],
            ['name' => 'Contracts Store', 'route_name' => 'contracts.store'],
            ['name' => 'Contracts Edit', 'route_name' => 'contracts.edit'],
            ['name' => 'Contracts Update', 'route_name' => 'contracts.update'],
            ['name' => 'Contracts Delete', 'route_name' => 'contracts.destroy'],
            ['name' => 'Profile Personal Edit', 'route_name' => 'profile.personal.edit'],
            ['name' => 'Profile Personal Update', 'route_name' => 'profile.personal.update'],
            ['name' => 'Companies Index', 'route_name' => 'companies.index'],
            ['name' => 'Companies Create', 'route_name' => 'companies.create'],
            ['name' => 'Companies Store', 'route_name' => 'companies.store'],
            ['name' => 'Companies Edit', 'route_name' => 'companies.edit'],
            ['name' => 'Companies Update', 'route_name' => 'companies.update'],
            ['name' => 'Companies Delete', 'route_name' => 'companies.destroy'],
            ['name' => 'Employee Ranks Index', 'route_name' => 'employee-ranks.index'],
            ['name' => 'Employee Ranks Create', 'route_name' => 'employee-ranks.create'],
            ['name' => 'Employee Ranks Store', 'route_name' => 'employee-ranks.store'],
            ['name' => 'Employee Ranks Edit', 'route_name' => 'employee-ranks.edit'],
            ['name' => 'Employee Ranks Update', 'route_name' => 'employee-ranks.update'],
            ['name' => 'Employee Ranks Delete', 'route_name' => 'employee-ranks.destroy'],
            ['name' => 'Employee Ranks Reorder', 'route_name' => 'employee-ranks.reorder'],
            ['name' => 'Approval Workflows Index', 'route_name' => 'approval-workflows.index'],
            ['name' => 'Approval Workflows Create', 'route_name' => 'approval-workflows.create'],
            ['name' => 'Approval Workflows Store', 'route_name' => 'approval-workflows.store'],
            ['name' => 'Approval Workflows Edit', 'route_name' => 'approval-workflows.edit'],
            ['name' => 'Approval Workflows Update', 'route_name' => 'approval-workflows.update'],
            ['name' => 'Approval Workflows Delete', 'route_name' => 'approval-workflows.destroy'],
            ['name' => 'Approval Workflow Steps Store', 'route_name' => 'approval-workflow-steps.store'],
            ['name' => 'Approval Workflow Steps Delete', 'route_name' => 'approval-workflow-steps.destroy'],
            ['name' => 'Leave Request Approvals Index', 'route_name' => 'leave-request-approvals.index'],
            ['name' => 'Leave Request Approvals Update', 'route_name' => 'leave-request-approvals.update'],
            ['name' => 'Notifications Index', 'route_name' => 'notifications.index'],
            ['name' => 'Notifications Create', 'route_name' => 'notifications.create'],
            ['name' => 'Notifications Store', 'route_name' => 'notifications.store'],
            ['name' => 'Notifications Read All', 'route_name' => 'notifications.read-all'],
            ['name' => 'Notifications Read', 'route_name' => 'notifications.read'],
        ];

        foreach ($routes as $route) {
            Route::firstOrCreate(['route_name' => $route['route_name']], $route);
        }

        // First make sure we have the sections, or rely on DashboardMenuSectionSeeder being called first.
        // Assuming Tables is ID 1 and Settings is ID 2 if seeded in order. Let's just fetch them to be safe.
        $tablesSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Form'], ['order' => 1]);
        $masterDataSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Master Data'], ['order' => 3]);
        $settingsSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Web Setting'], ['order' => 4]);

        // 1. Forms Section
        DashboardMenu::create([
            'name' => 'Pengajuan Izin',
            'icon' => 'HiDocumentText',
            'route_id' => 46,
            'section_id' => $tablesSection->id,
            'type' => 'Single',
            'position' => 1,
        ]);

        // 2. Web Setting Section (Parent & Children)
        $settingsParent = DashboardMenu::create([
            'name' => 'Web Setting',
            'icon' => 'HiCog',
            'section_id' => $settingsSection->id,
            'type' => 'Dropdown',
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Routes',
            'icon' => 'HiLink',
            'route_id' => 3,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Menu',
            'icon' => 'HiMenuAlt2',
            'route_id' => 14,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 2,
        ]);

        DashboardMenu::create([
            'name' => 'Menu Sections',
            'icon' => 'HiViewGrid',
            'route_id' => 31,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 3,
        ]);

        // 3. Master Data Section (Flat)
        DashboardMenu::create([
            'name' => 'Users',
            'icon' => 'HiUser',
            'route_id' => 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Devisions',
            'icon' => 'HiOfficeBuilding',
            'route_id' => 38,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 2,
        ]);
        
        DashboardMenu::create([
            'name' => 'Companies',
            'icon' => 'HiLibrary',
            'route_id' => \App\Models\Route::where('route_name', 'companies.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 3,
        ]);

        DashboardMenu::create([
            'name' => 'Employee Ranks',
            'icon' => 'HiIdentification',
            'route_id' => \App\Models\Route::where('route_name', 'employee-ranks.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 4,
        ]);

        DashboardMenu::create([
            'name' => 'Roles',
            'icon' => 'HiShieldCheck',
            'route_id' => 2,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 5,
        ]);

        DashboardMenu::create([
            'name' => 'Permissions',
            'icon' => 'HiOutlineLogin',
            'route_id' => 8,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 6,
        ]);

        DashboardMenu::create([
            'name' => 'Approval Workflow',
            'icon' => 'HiClipboardCheck',
            'route_id' => \App\Models\Route::where('route_name', 'approval-workflows.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 7,
        ]);

        DashboardMenu::create([
            'name' => 'Notifications',
            'icon' => 'HiBell',
            'route_id' => \App\Models\Route::where('route_name', 'notifications.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 8,
        ]);

        $hrSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'HR'], ['order' => 2]);

        $hrParent = DashboardMenu::create([
            'name' => 'Karyawan',
            'icon' => 'HiUsers',
            'section_id' => $hrSection->id,
            'type' => 'Dropdown',
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Registrasi Karyawan',
            'icon' => 'HiIdentification',
            'route_id' => \App\Models\Route::where('route_name', 'employee-registrations.index')->first()->id ?? 1,
            'section_id' => $hrSection->id,
            'type' => 'Single',
            'parent_id' => $hrParent->id,
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Manajemen Kontrak',
            'icon' => 'HiDocumentDuplicate',
            'route_id' => \App\Models\Route::where('route_name', 'contracts.index')->first()->id ?? 1,
            'section_id' => $hrSection->id,
            'type' => 'Single',
            'parent_id' => $hrParent->id,
            'position' => 2,
        ]);

        DashboardMenu::create([
            'name' => 'Approval Cuti',
            'icon' => 'HiCheckCircle',
            'route_id' => \App\Models\Route::where('route_name', 'leave-request-approvals.index')->first()?->id ?? 1,
            'section_id' => $hrSection->id,
            'type' => 'Single',
            'parent_id' => $hrParent->id,
            'position' => 3,
        ]);

        // 3. Assign all routes to Admin role (id = 1)
        $roles = \App\Models\Role::all();
        foreach ($roles as $role) {
            foreach (Route::all() as $route) {
                RolePermission::create([
                    'role_id' => $role->id,
                    'route_id' => $route->id,
                ]);
            }
        }
    }
}
