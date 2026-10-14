<?php

namespace Database\Seeders;

use App\Models\DashboardMenu;
use App\Models\DashboardMenuSection;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\Route;
use Illuminate\Database\Seeder;

/**
 * Seeder idempotent untuk modul GA: memastikan route, hak akses (Web Dev),
 * section menu "GA", dan item menu-nya ada. Aman dijalankan berulang.
 */
class GaSetupSeeder extends Seeder
{
    public function run(): void
    {
        $routes = [
            ['name' => 'Kategori Barang', 'route_name' => 'asset-categories.index'],
            ['name' => 'Simpan Kategori Barang', 'route_name' => 'asset-categories.store'],
            ['name' => 'Perbarui Kategori Barang', 'route_name' => 'asset-categories.update'],
            ['name' => 'Hapus Kategori Barang', 'route_name' => 'asset-categories.destroy'],
            ['name' => 'Daftar Barang', 'route_name' => 'assets.index'],
            ['name' => 'Tambah Barang', 'route_name' => 'assets.create'],
            ['name' => 'Simpan Barang', 'route_name' => 'assets.store'],
            ['name' => 'Detail Barang', 'route_name' => 'assets.show'],
            ['name' => 'Edit Barang', 'route_name' => 'assets.edit'],
            ['name' => 'Perbarui Barang', 'route_name' => 'assets.update'],
            ['name' => 'Hapus Barang', 'route_name' => 'assets.destroy'],
            ['name' => 'Penempatan Barang', 'route_name' => 'asset-assignments.index'],
            ['name' => 'Serahkan Barang', 'route_name' => 'asset-assignments.store'],
            ['name' => 'Kembalikan Barang', 'route_name' => 'asset-assignments.return'],
            ['name' => 'Service Barang', 'route_name' => 'asset-services.index'],
            ['name' => 'Buat Tiket Service', 'route_name' => 'asset-services.store'],
            ['name' => 'Update Service Barang', 'route_name' => 'asset-services.update'],
            ['name' => 'Pengajuan Barang', 'route_name' => 'asset-requests.index'],
            ['name' => 'Buat Pengajuan Barang', 'route_name' => 'asset-requests.create'],
            ['name' => 'Simpan Pengajuan Barang', 'route_name' => 'asset-requests.store'],
            ['name' => 'Detail Pengajuan Barang', 'route_name' => 'asset-requests.show'],
            ['name' => 'Batalkan Pengajuan Barang', 'route_name' => 'asset-requests.cancel'],
            ['name' => 'Approval Pengajuan Barang', 'route_name' => 'asset-request-approvals.index'],
            ['name' => 'Proses Approval Pengajuan Barang', 'route_name' => 'asset-request-approvals.update'],
        ];

        foreach ($routes as $route) {
            Route::firstOrCreate(['route_name' => $route['route_name']], $route);
        }

        // Beri hak akses ke role Web Dev + role Divisi GA
        $roleNames = ['Web Dev', 'Admin GA', 'Manager GA', 'Supervisor GA'];
        $roles = Role::whereIn('name', $roleNames)->get();

        foreach ($roles as $role) {
            foreach (Route::whereIn('route_name', array_column($routes, 'route_name'))->get() as $route) {
                RolePermission::firstOrCreate([
                    'role_id' => $role->id,
                    'route_id' => $route->id,
                ]);
            }
        }

        // Section menu GA
        $gaSection = DashboardMenuSection::firstOrCreate(['name' => 'GA'], ['order' => 5]);

        $parent = DashboardMenu::firstOrCreate(
            ['name' => 'Manajemen Barang', 'section_id' => $gaSection->id],
            ['icon' => 'HiCube', 'type' => 'Dropdown', 'position' => 1]
        );

        DashboardMenu::firstOrCreate(
            ['name' => 'Daftar Barang', 'section_id' => $gaSection->id, 'parent_id' => $parent->id],
            [
                'icon' => 'HiClipboardList',
                'route_id' => Route::where('route_name', 'assets.index')->first()?->id,
                'type' => 'Single',
                'position' => 1,
            ]
        );

        DashboardMenu::firstOrCreate(
            ['name' => 'Kategori Barang', 'section_id' => $gaSection->id, 'parent_id' => $parent->id],
            [
                'icon' => 'HiTag',
                'route_id' => Route::where('route_name', 'asset-categories.index')->first()?->id,
                'type' => 'Single',
                'position' => 2,
            ]
        );

        DashboardMenu::firstOrCreate(
            ['name' => 'Penempatan Barang', 'section_id' => $gaSection->id, 'parent_id' => $parent->id],
            [
                'icon' => 'HiUserAdd',
                'route_id' => Route::where('route_name', 'asset-assignments.index')->first()?->id,
                'type' => 'Single',
                'position' => 3,
            ]
        );

        DashboardMenu::firstOrCreate(
            ['name' => 'Service Barang', 'section_id' => $gaSection->id, 'parent_id' => $parent->id],
            [
                'icon' => 'HiCog',
                'route_id' => Route::where('route_name', 'asset-services.index')->first()?->id,
                'type' => 'Single',
                'position' => 4,
            ]
        );

        DashboardMenu::firstOrCreate(
            ['name' => 'Pengajuan Barang', 'section_id' => $gaSection->id, 'parent_id' => $parent->id],
            [
                'icon' => 'HiDocumentText',
                'route_id' => Route::where('route_name', 'asset-requests.index')->first()?->id,
                'type' => 'Single',
                'position' => 5,
            ]
        );

        DashboardMenu::firstOrCreate(
            ['name' => 'Approval Barang', 'section_id' => $gaSection->id, 'parent_id' => $parent->id],
            [
                'icon' => 'HiClipboardCheck',
                'route_id' => Route::where('route_name', 'asset-request-approvals.index')->first()?->id,
                'type' => 'Single',
                'position' => 6,
            ]
        );
    }
}
