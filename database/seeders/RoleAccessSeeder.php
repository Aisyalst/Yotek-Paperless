<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\RolePermission;
use App\Models\Route;
use Illuminate\Database\Seeder;

/**
 * Seeder idempotent: memberi hak akses (role_permissions) ke SETIAP role
 * berdasarkan pola jabatan + divisi.
 *
 * WAJIB dijalankan SETELAH RouteSettingSeeder (yang mendaftarkan seluruh route,
 * section, dan menu sidebar), karena seeder ini butuh semua route sudah ada.
 */
class RoleAccessSeeder extends Seeder
{
    /**
     * Akses dasar untuk SEMUA role:
     * Beranda, Profil, Notifikasi, Daftar Formulir (Izin + Barang), dan Meeting.
     */
    private array $baseline = [
        'dashboard',

        'profile.index', 'profile.edit', 'profile.update',
        'profile.personal.edit', 'profile.personal.update',
        'profile.leave-history', 'profile.destroy',

        'notifications.index', 'notifications.create', 'notifications.store',
        'notifications.read', 'notifications.read-all',

        // Daftar Formulir — Pengajuan Izin
        'leave-requests.index', 'leave-requests.create', 'leave-requests.store',
        'leave-requests.show', 'leave-requests.export', 'leave-requests.upload-doctor-note',

        // Daftar Formulir — Pengajuan Barang
        'asset-requests.index', 'asset-requests.create', 'asset-requests.store',
        'asset-requests.show', 'asset-requests.cancel',

        // Meeting
        'meetings.index', 'my-meetings.index', 'my-meetings.respond',
    ];

    /**
     * Tambahan untuk role approver (Head / Manager / Supervisor / Direktur):
     * persetujuan izin, approval barang, dan pengelolaan jadwal meeting.
     */
    private array $approver = [
        'leave-request-approvals.index', 'leave-request-approvals.update', 'leave-request-approvals.set-consequence',
        'asset-request-approvals.index', 'asset-request-approvals.update',
        'meetings.create', 'meetings.store', 'meetings.show',
        'meetings.edit', 'meetings.update', 'meetings.destroy',
    ];

    /** Modul GA — hanya untuk role manajemen (Admin/Manager/Supervisor/Head) di divisi GA. */
    private array $gaModule = [
        'asset-categories.index', 'asset-categories.store', 'asset-categories.update', 'asset-categories.destroy',
        'assets.index', 'assets.create', 'assets.store', 'assets.show',
        'assets.edit', 'assets.update', 'assets.destroy',
        'asset-assignments.index', 'asset-assignments.store', 'asset-assignments.return',
        'asset-services.index', 'asset-services.store', 'asset-services.update',
        'asset-request-approvals.index', 'asset-request-approvals.update',
    ];

    /** Modul HR — hanya untuk role manajemen (Admin/Manager/Supervisor/Head) di divisi HR. */
    private array $hrModule = [
        'employee-registrations.index', 'employee-registrations.create', 'employee-registrations.store',
        'employee-registrations.edit', 'employee-registrations.update', 'employee-registrations.destroy',
        'contracts.index', 'contracts.create', 'contracts.store',
        'contracts.edit', 'contracts.update', 'contracts.destroy',
        'leave-entitlements.index', 'leave-entitlements.create', 'leave-entitlements.store',
        'leave-entitlements.edit', 'leave-entitlements.update', 'leave-entitlements.destroy',
        'leave-request-approvals.index', 'leave-request-approvals.update', 'leave-request-approvals.set-consequence',
    ];

    public function run(): void
    {
        $routeId = Route::pluck('id', 'route_name');

        foreach (Role::with('devision')->get() as $role) {
            $ids = collect($this->routesFor($role))
                ->map(fn ($name) => $routeId[$name] ?? null)
                ->filter()
                ->unique()
                ->values();

            // Reset lalu isi ulang -> idempotent & bebas duplikat.
            RolePermission::where('role_id', $role->id)->delete();

            $ids->chunk(200)->each(function ($chunk) use ($role) {
                $now = now();
                RolePermission::insert($chunk->map(fn ($id) => [
                    'role_id' => $role->id,
                    'route_id' => $id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->all());
            });
        }

        // Catatan: urutan section sidebar & penempatan menu "Pengajuan Barang"
        // ditangani oleh RouteSettingSeeder, bukan di sini.
    }

    /**
     * Hitung daftar route_name yang boleh diakses sebuah role.
     */
    private function routesFor(Role $role): array
    {
        // Web Dev = akses penuh ke seluruh route.
        if ($role->name === 'Web Dev') {
            return Route::pluck('route_name')->all();
        }

        $names = $this->baseline;
        $devision = strtolower($role->devision->name ?? '');

        // Approver: jabatan struktural yang berhak menyetujui.
        if (preg_match('/Head|Manager|Supervisor|Direktur/i', $role->name)) {
            $names = array_merge($names, $this->approver);
        }

        // Admin modul: role manajemen sesuai divisinya.
        $isManagement = (bool) preg_match('/Admin|Manager|Supervisor|Head|Direktur/i', $role->name);
        if ($devision === 'ga' && $isManagement) {
            $names = array_merge($names, $this->gaModule);
        }
        if ($devision === 'hr' && $isManagement) {
            $names = array_merge($names, $this->hrModule);
        }

        return array_values(array_unique($names));
    }
}
