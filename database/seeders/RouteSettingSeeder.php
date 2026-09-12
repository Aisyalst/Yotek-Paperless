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
            ['name' => 'Pengguna', 'route_name' => 'users.index'], // 1
            ['name' => 'Peran', 'route_name' => 'roles.index'], // 3
            ['name' => 'Rute', 'route_name' => 'routes.index'], // 4
            ['name' => 'Tambah Rute', 'route_name' => 'routes.create'], // 5
            ['name' => 'Simpan Rute', 'route_name' => 'routes.store'], // 6
            ['name' => 'Edit Rute', 'route_name' => 'routes.edit'], // 7
            ['name' => 'Perbarui Rute', 'route_name' => 'routes.update'], // 8
            ['name' => 'Hak Akses', 'route_name' => 'role-permissions.index'], // 9
            ['name' => 'Tambah Hak Akses', 'route_name' => 'role-permissions.create'], // 10
            ['name' => 'Simpan Hak Akses', 'route_name' => 'role-permissions.store'], // 11
            ['name' => 'Edit Hak Akses', 'route_name' => 'role-permissions.edit'], // 12
            ['name' => 'Perbarui Hak Akses', 'route_name' => 'role-permissions.update'], // 13
            ['name' => 'Hapus Hak Akses', 'route_name' => 'role-permissions.destroy'], // 14
            ['name' => 'Sinkronisasi Massal Hak Akses', 'route_name' => 'role-permissions.batch-sync'], // 15
            ['name' => 'Menu', 'route_name' => 'dashboard-menus.index'], // 16
            ['name' => 'Tambah Menu', 'route_name' => 'dashboard-menus.create'], // 16
            ['name' => 'Simpan Menu', 'route_name' => 'dashboard-menus.store'], // 17
            ['name' => 'Edit Menu', 'route_name' => 'dashboard-menus.edit'], // 18
            ['name' => 'Perbarui Menu', 'route_name' => 'dashboard-menus.update'], // 19
            ['name' => 'Hapus Menu', 'route_name' => 'dashboard-menus.destroy'], // 20
            ['name' => 'Tambah Pengguna', 'route_name' => 'users.create'], // 16
            ['name' => 'Simpan Pengguna', 'route_name' => 'users.store'], // 17
            ['name' => 'Edit Pengguna', 'route_name' => 'users.edit'], // 18
            ['name' => 'Perbarui Pengguna', 'route_name' => 'users.update'], // 19
            ['name' => 'Hapus Pengguna', 'route_name' => 'users.destroy'], // 20
            ['name' => 'Tambah Peran', 'route_name' => 'roles.create'], // 16
            ['name' => 'Simpan Peran', 'route_name' => 'roles.store'], // 17
            ['name' => 'Edit Peran', 'route_name' => 'roles.edit'], // 18
            ['name' => 'Perbarui Peran', 'route_name' => 'roles.update'], // 19
            ['name' => 'Hapus Peran', 'route_name' => 'roles.destroy'], // 29
            ['name' => 'Urutkan Menu', 'route_name' => 'dashboard-menus.reorder'], // 30

            // Dashboard Menu Section Routes
            ['name' => 'Bagian Menu', 'route_name' => 'dashboard-menu-sections.index'], // 43
            ['name' => 'Tambah Bagian Menu', 'route_name' => 'dashboard-menu-sections.create'], // 44
            ['name' => 'Simpan Bagian Menu', 'route_name' => 'dashboard-menu-sections.store'], // 45
            ['name' => 'Urutkan Bagian Menu', 'route_name' => 'dashboard-menu-sections.reorder'], // 46
            ['name' => 'Edit Bagian Menu', 'route_name' => 'dashboard-menu-sections.edit'], // 47
            ['name' => 'Perbarui Bagian Menu', 'route_name' => 'dashboard-menu-sections.update'], // 48
            ['name' => 'Hapus Bagian Menu', 'route_name' => 'dashboard-menu-sections.destroy'], // 49
            // Devision Routes
            ['name' => 'Divisi', 'route_name' => 'devisions.index'], // 50
            ['name' => 'Tambah Divisi', 'route_name' => 'devisions.create'], // 51
            ['name' => 'Simpan Divisi', 'route_name' => 'devisions.store'], // 52
            ['name' => 'Edit Divisi', 'route_name' => 'devisions.edit'], // 53
            ['name' => 'Perbarui Divisi', 'route_name' => 'devisions.update'], // 54
            ['name' => 'Hapus Divisi', 'route_name' => 'devisions.destroy'], // 55
            ['name' => 'Beranda', 'route_name' => 'dashboard'],
            ['name' => 'Profil', 'route_name' => 'profile.index'],
            ['name' => 'Pengajuan Izin', 'route_name' => 'leave-requests.index'],
            ['name' => 'Tambah Pengajuan Izin', 'route_name' => 'leave-requests.create'],
            ['name' => 'Simpan Pengajuan Izin', 'route_name' => 'leave-requests.store'],
            ['name' => 'Detail Pengajuan Izin', 'route_name' => 'leave-requests.show'],
            ['name' => 'Unggah Surat Dokter', 'route_name' => 'leave-requests.upload-doctor-note'],
            ['name' => 'Registrasi Karyawan', 'route_name' => 'employee-registrations.index'],
            ['name' => 'Tambah Registrasi Karyawan', 'route_name' => 'employee-registrations.create'],
            ['name' => 'Simpan Registrasi Karyawan', 'route_name' => 'employee-registrations.store'],
            ['name' => 'Edit Registrasi Karyawan', 'route_name' => 'employee-registrations.edit'],
            ['name' => 'Perbarui Registrasi Karyawan', 'route_name' => 'employee-registrations.update'],
            ['name' => 'Hapus Registrasi Karyawan', 'route_name' => 'employee-registrations.destroy'],
            ['name' => 'Manajemen Kontrak', 'route_name' => 'contracts.index'],
            ['name' => 'Tambah Kontrak', 'route_name' => 'contracts.create'],
            ['name' => 'Simpan Kontrak', 'route_name' => 'contracts.store'],
            ['name' => 'Edit Kontrak', 'route_name' => 'contracts.edit'],
            ['name' => 'Perbarui Kontrak', 'route_name' => 'contracts.update'],
            ['name' => 'Hapus Kontrak', 'route_name' => 'contracts.destroy'],
            ['name' => 'Edit Profil Pribadi', 'route_name' => 'profile.personal.edit'],
            ['name' => 'Perbarui Profil Pribadi', 'route_name' => 'profile.personal.update'],
            ['name' => 'Perusahaan', 'route_name' => 'companies.index'],
            ['name' => 'Tambah Perusahaan', 'route_name' => 'companies.create'],
            ['name' => 'Simpan Perusahaan', 'route_name' => 'companies.store'],
            ['name' => 'Edit Perusahaan', 'route_name' => 'companies.edit'],
            ['name' => 'Perbarui Perusahaan', 'route_name' => 'companies.update'],
            ['name' => 'Hapus Perusahaan', 'route_name' => 'companies.destroy'],
            ['name' => 'Golongan Karyawan', 'route_name' => 'employee-ranks.index'],
            ['name' => 'Tambah Golongan Karyawan', 'route_name' => 'employee-ranks.create'],
            ['name' => 'Simpan Golongan Karyawan', 'route_name' => 'employee-ranks.store'],
            ['name' => 'Edit Golongan Karyawan', 'route_name' => 'employee-ranks.edit'],
            ['name' => 'Perbarui Golongan Karyawan', 'route_name' => 'employee-ranks.update'],
            ['name' => 'Hapus Golongan Karyawan', 'route_name' => 'employee-ranks.destroy'],
            ['name' => 'Urutkan Golongan Karyawan', 'route_name' => 'employee-ranks.reorder'],
            ['name' => 'Alur Persetujuan', 'route_name' => 'approval-workflows.index'],
            ['name' => 'Tambah Alur Persetujuan', 'route_name' => 'approval-workflows.create'],
            ['name' => 'Simpan Alur Persetujuan', 'route_name' => 'approval-workflows.store'],
            ['name' => 'Edit Alur Persetujuan', 'route_name' => 'approval-workflows.edit'],
            ['name' => 'Perbarui Alur Persetujuan', 'route_name' => 'approval-workflows.update'],
            ['name' => 'Hapus Alur Persetujuan', 'route_name' => 'approval-workflows.destroy'],
            ['name' => 'Simpan Langkah Persetujuan', 'route_name' => 'approval-workflow-steps.store'],
            ['name' => 'Hapus Langkah Persetujuan', 'route_name' => 'approval-workflow-steps.destroy'],
            ['name' => 'Persetujuan Izin', 'route_name' => 'leave-request-approvals.index'],
            ['name' => 'Perbarui Persetujuan Izin', 'route_name' => 'leave-request-approvals.update'],
            ['name' => 'Notifikasi', 'route_name' => 'notifications.index'],
            ['name' => 'Tambah Notifikasi', 'route_name' => 'notifications.create'],
            ['name' => 'Simpan Notifikasi', 'route_name' => 'notifications.store'],
            ['name' => 'Baca Semua Notifikasi', 'route_name' => 'notifications.read-all'],
            ['name' => 'Baca Notifikasi', 'route_name' => 'notifications.read'],
            
            ['name' => 'Banner', 'route_name' => 'banners.index'],
            ['name' => 'Tambah Banner', 'route_name' => 'banners.create'],
            ['name' => 'Simpan Banner', 'route_name' => 'banners.store'],
            ['name' => 'Edit Banner', 'route_name' => 'banners.edit'],
            ['name' => 'Perbarui Banner', 'route_name' => 'banners.update'],
            ['name' => 'Hapus Banner', 'route_name' => 'banners.destroy'],
            ['name' => 'Urutkan Banner', 'route_name' => 'banners.reorder'],
            
            ['name' => 'Album Perusahaan', 'route_name' => 'company-albums.index'],
            ['name' => 'Tambah Album Perusahaan', 'route_name' => 'company-albums.create'],
            ['name' => 'Simpan Album Perusahaan', 'route_name' => 'company-albums.store'],
            ['name' => 'Hapus Album Perusahaan', 'route_name' => 'company-albums.destroy'],

            ['name' => 'Akses Cepat', 'route_name' => 'quick-accesses.index'],
            ['name' => 'Tambah Akses Cepat', 'route_name' => 'quick-accesses.create'],
            ['name' => 'Simpan Akses Cepat', 'route_name' => 'quick-accesses.store'],
            ['name' => 'Edit Akses Cepat', 'route_name' => 'quick-accesses.edit'],
            ['name' => 'Perbarui Akses Cepat', 'route_name' => 'quick-accesses.update'],
            ['name' => 'Hapus Akses Cepat', 'route_name' => 'quick-accesses.destroy'],
            ['name' => 'Urutkan Akses Cepat', 'route_name' => 'quick-accesses.reorder'],
            
            ['name' => 'Hak Cuti', 'route_name' => 'leave-entitlements.index'],
            ['name' => 'Tambah Hak Cuti', 'route_name' => 'leave-entitlements.create'],
            ['name' => 'Simpan Hak Cuti', 'route_name' => 'leave-entitlements.store'],
            ['name' => 'Edit Hak Cuti', 'route_name' => 'leave-entitlements.edit'],
            ['name' => 'Perbarui Hak Cuti', 'route_name' => 'leave-entitlements.update'],
            ['name' => 'Hapus Hak Cuti', 'route_name' => 'leave-entitlements.destroy'],
        ];

        foreach ($routes as $route) {
            Route::firstOrCreate(['route_name' => $route['route_name']], $route);
        }

        // First make sure we have the sections, or rely on DashboardMenuSectionSeeder being called first.
        // Assuming Tables is ID 1 and Settings is ID 2 if seeded in order. Let's just fetch them to be safe.
        $tablesSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Formulir'], ['order' => 1]);
        $masterDataSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Data Master'], ['order' => 3]);
        $settingsSection = \App\Models\DashboardMenuSection::firstOrCreate(['name' => 'Pengaturan Web'], ['order' => 4]);

        // 1. Forms Section
        DashboardMenu::create([
            'name' => 'Pengajuan Izin',
            'icon' => 'HiDocumentText',
            'route_id' => \App\Models\Route::where('route_name', 'leave-requests.index')->first()?->id ?? 1,
            'section_id' => $tablesSection->id,
            'type' => 'Single',
            'position' => 1,
        ]);

        // 2. Web Setting Section (Parent & Children)
        $settingsParent = DashboardMenu::create([
            'name' => 'Pengaturan Web',
            'icon' => 'HiCog',
            'section_id' => $settingsSection->id,
            'type' => 'Dropdown',
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Rute',
            'icon' => 'HiLink',
            'route_id' => \App\Models\Route::where('route_name', 'routes.index')->first()?->id ?? 1,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Menu',
            'icon' => 'HiMenuAlt2',
            'route_id' => \App\Models\Route::where('route_name', 'dashboard-menus.index')->first()?->id ?? 1,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 2,
        ]);

        DashboardMenu::create([
            'name' => 'Bagian Menu',
            'icon' => 'HiViewGrid',
            'route_id' => \App\Models\Route::where('route_name', 'dashboard-menu-sections.index')->first()?->id ?? 1,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $settingsParent->id,
            'position' => 3,
        ]);

        $dashboardBerandaMenu = DashboardMenu::create([
            'name' => 'Management Dashboard',
            'icon' => 'HiTemplate',
            'section_id' => $settingsSection->id,
            'type' => 'Dropdown',
            'position' => 10,
        ]);

        DashboardMenu::create([
            'name' => 'Banner',
            'icon' => 'HiPhotograph',
            'route_id' => \App\Models\Route::where('route_name', 'banners.index')->first()?->id ?? 1,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $dashboardBerandaMenu->id,
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Album Perusahaan',
            'icon' => 'HiCamera',
            'route_id' => \App\Models\Route::where('route_name', 'company-albums.index')->first()?->id ?? 1,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $dashboardBerandaMenu->id,
            'position' => 2,
        ]);

        DashboardMenu::create([
            'name' => 'Akses Cepat',
            'icon' => 'HiLightningBolt',
            'route_id' => \App\Models\Route::where('route_name', 'quick-accesses.index')->first()?->id ?? 1,
            'section_id' => $settingsSection->id,
            'type' => 'Single',
            'parent_id' => $dashboardBerandaMenu->id,
            'position' => 3,
        ]);

        // 3. Master Data Section (Flat)
        DashboardMenu::create([
            'name' => 'Pengguna',
            'icon' => 'HiUser',
            'route_id' => \App\Models\Route::where('route_name', 'users.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 1,
        ]);

        DashboardMenu::create([
            'name' => 'Divisi',
            'icon' => 'HiOfficeBuilding',
            'route_id' => \App\Models\Route::where('route_name', 'devisions.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 2,
        ]);
        
        DashboardMenu::create([
            'name' => 'Perusahaan',
            'icon' => 'HiLibrary',
            'route_id' => \App\Models\Route::where('route_name', 'companies.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 3,
        ]);

        DashboardMenu::create([
            'name' => 'Golongan Karyawan',
            'icon' => 'HiIdentification',
            'route_id' => \App\Models\Route::where('route_name', 'employee-ranks.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 4,
        ]);

        DashboardMenu::create([
            'name' => 'Peran',
            'icon' => 'HiShieldCheck',
            'route_id' => \App\Models\Route::where('route_name', 'roles.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 5,
        ]);

        DashboardMenu::create([
            'name' => 'Hak Akses',
            'icon' => 'HiOutlineLogin',
            'route_id' => \App\Models\Route::where('route_name', 'role-permissions.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 6,
        ]);

        DashboardMenu::create([
            'name' => 'Alur Persetujuan',
            'icon' => 'HiClipboardCheck',
            'route_id' => \App\Models\Route::where('route_name', 'approval-workflows.index')->first()?->id ?? 1,
            'section_id' => $masterDataSection->id,
            'type' => 'Single',
            'position' => 7,
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
            'name' => 'Persetujuan Izin',
            'icon' => 'HiCheckCircle',
            'route_id' => \App\Models\Route::where('route_name', 'leave-request-approvals.index')->first()?->id ?? 1,
            'section_id' => $hrSection->id,
            'type' => 'Single',
            'parent_id' => $hrParent->id,
            'position' => 3,
        ]);

        DashboardMenu::create([
            'name' => 'Hak Cuti',
            'icon' => 'HiOutlineTicket',
            'route_id' => \App\Models\Route::where('route_name', 'leave-entitlements.index')->first()?->id ?? 1,
            'section_id' => $hrSection->id,
            'type' => 'Single',
            'parent_id' => $hrParent->id,
            'position' => 4,
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
