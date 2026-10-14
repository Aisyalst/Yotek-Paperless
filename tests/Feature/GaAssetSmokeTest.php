<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GaAssetSmokeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Role GA biasanya dibuat oleh seeder data karyawan; di test dibuat manual dulu.
        $gaDevision = \App\Models\Devision::firstOrCreate(['name' => 'GA']);
        foreach (['Web Dev', 'Admin GA', 'Manager GA', 'Supervisor GA'] as $rn) {
            \App\Models\Role::firstOrCreate(
                ['name' => $rn],
                ['devision_id' => $rn === 'Web Dev' ? null : $gaDevision->id]
            );
        }
        $this->seed(\Database\Seeders\RouteSettingSeeder::class);
        $this->seed(\Database\Seeders\AssetCategorySeeder::class);
        // Hak akses terpusat: Web Dev = penuh, role GA = modul GA (via RoleAccessSeeder).
        $this->seed(\Database\Seeders\RoleAccessSeeder::class);
    }

    private function admin(): User
    {
        $user = User::factory()->create();
        $role = \App\Models\Role::where('name', 'Web Dev')->firstOrFail();
        $user->roles()->syncWithoutDetaching([$role->id]);
        return $user;
    }

    public function test_index_and_show_render(): void
    {
        $user = $this->admin();

        $this->actingAs($user)->get('/assets')->assertOk();

        $asset = Asset::create([
            'asset_code' => 'AST-9001',
            'qr_token' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Laptop Test',
            'condition' => 'Baik',
            'status' => 'Tersedia',
        ]);

        $this->actingAs($user)->get('/assets/'.$asset->id)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Dashboard/GA/Asset/Show')
                ->has('qr_svg')
                ->where('qr_svg', fn ($svg) => str_contains($svg, '<svg') && !str_contains($svg, '<?xml'))
            );
        $this->actingAs($user)->get('/assets/create')->assertOk();
        $this->actingAs($user)->get('/asset-categories')->assertOk();
    }

    public function test_store_creates_asset_with_code_and_qr(): void
    {
        $user = $this->admin();

        $this->actingAs($user)->post('/assets', [
            'name' => 'Proyektor Epson',
            'condition' => 'Baik',
            'status' => 'Tersedia',
        ])->assertRedirect(route('assets.index'));

        $asset = Asset::where('name', 'Proyektor Epson')->firstOrFail();
        $this->assertMatchesRegularExpression('/^AST-\d{4}$/', $asset->asset_code);
        $this->assertNotEmpty($asset->qr_token);
    }

    public function test_assign_and_return_asset_to_employee(): void
    {
        $admin = $this->admin();
        $employee = User::factory()->create([
            'nik' => '100200012',
            'name' => 'Penerima Test',
        ]);

        $asset = Asset::create([
            'asset_code' => 'AST-9101',
            'qr_token' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Laptop Dipegang',
            'condition' => 'Baik',
            'status' => 'Tersedia',
        ]);

        // Halaman index penempatan render OK
        $this->actingAs($admin)->get('/asset-assignments')->assertOk()->assertInertia(
            fn ($page) => $page->component('Dashboard/GA/AssetAssignment/Index')
        );

        // Serahkan barang
        $this->actingAs($admin)->post('/asset-assignments', [
            'asset_id' => $asset->id,
            'employee_nik' => $employee->nik,
            'assigned_date' => '2026-10-14',
            'condition_on_assign' => 'Baik',
        ])->assertRedirect(route('asset-assignments.index'));

        $assignment = \App\Models\AssetAssignment::where('asset_id', $asset->id)->firstOrFail();
        $this->assertSame('Aktif', $assignment->status);
        $this->assertSame($employee->nik, $assignment->employee_nik);
        $this->assertSame('Dipegang', $asset->fresh()->status);

        // Tidak boleh diserahkan lagi selagi masih dipegang
        $this->actingAs($admin)->post('/asset-assignments', [
            'asset_id' => $asset->id,
            'employee_nik' => $employee->nik,
            'assigned_date' => '2026-10-14',
        ])->assertSessionHas('error');

        // Kembalikan barang
        $this->actingAs($admin)
            ->patch("/asset-assignments/{$assignment->id}/return", [
                'returned_date' => '2026-10-15',
                'condition_on_return' => 'Baik',
            ])->assertRedirect(route('asset-assignments.index'));

        $this->assertSame('Dikembalikan', $assignment->fresh()->status);
        $this->assertSame('Tersedia', $asset->fresh()->status);
        $this->assertSame('Baik', $asset->fresh()->condition);
    }

    public function test_service_ticket_flow(): void
    {
        $admin = $this->admin();

        $asset = Asset::create([
            'asset_code' => 'AST-9201',
            'qr_token' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Printer Rusak',
            'condition' => 'Rusak Ringan',
            'status' => 'Tersedia',
        ]);

        // Index render OK
        $this->actingAs($admin)->get('/asset-services')->assertOk()->assertInertia(
            fn ($page) => $page->component('Dashboard/GA/AssetService/Index')
        );

        // Buat tiket service -> barang jadi "Service"
        $this->actingAs($admin)->post('/asset-services', [
            'asset_id' => $asset->id,
            'service_type' => 'Perbaikan',
            'service_date' => '2026-10-14',
            'vendor' => 'Bengkel Jaya',
            'complaint' => 'Tidak mau menyala',
            'cost' => 150000,
        ])->assertRedirect(route('asset-services.index'));

        $service = \App\Models\AssetService::where('asset_id', $asset->id)->firstOrFail();
        $this->assertMatchesRegularExpression('/^SVC-\d{4}$/', $service->service_number);
        $this->assertSame('Diajukan', $service->status);
        $this->assertSame('Service', $asset->fresh()->status);

        // Update -> Selesai, barang kembali Tersedia
        $this->actingAs($admin)
            ->patch("/asset-services/{$service->id}", [
                'status' => 'Selesai',
                'action_taken' => 'Ganti power supply',
                'cost' => 200000,
                'result' => 'Normal kembali',
            ])->assertRedirect(route('asset-services.index'));

        $service->refresh();
        $this->assertSame('Selesai', $service->status);
        $this->assertNotNull($service->completed_date);
        $this->assertSame('Tersedia', $asset->fresh()->status);
    }

    public function test_asset_request_flow_with_signature_approval(): void
    {
        $requester = $this->admin();
        $requester->forceFill(['nik' => '100200900'])->save();

        // Approver fallback: role Admin GA (dipakai karena tak ada workflow & atasan langsung).
        $adminGaRole = \App\Models\Role::firstOrCreate(['name' => 'Admin GA']);
        $webDevRole = \App\Models\Role::where('name', 'Web Dev')->firstOrFail();
        $approver = User::factory()->create(['nik' => '100200901', 'name' => 'Approver GA']);
        $approver->roles()->syncWithoutDetaching([$adminGaRole->id, $webDevRole->id]);

        // Index & create render OK
        $this->actingAs($requester)->get('/asset-requests')->assertOk()->assertInertia(
            fn ($page) => $page->component('Dashboard/GA/AssetRequest/Index')
        );
        $this->actingAs($requester)->get('/asset-requests/create')->assertOk()->assertInertia(
            fn ($page) => $page->component('Dashboard/GA/AssetRequest/Create')
        );

        // Kirim pengajuan multi-item
        $this->actingAs($requester)->post('/asset-requests', [
            'request_date' => '2026-10-14',
            'priority' => 'Tinggi',
            'purpose' => 'Kebutuhan operasional',
            'items' => [
                ['item_name' => 'Kertas A4', 'qty' => 5, 'unit' => 'Rim', 'estimated_price' => 60000],
                ['item_name' => 'Tinta Printer', 'qty' => 2, 'unit' => 'Pcs', 'estimated_price' => 150000],
            ],
        ])->assertRedirect(route('asset-requests.index'));

        $req = \App\Models\AssetRequest::where('employee_nik', '100200900')->firstOrFail();
        $this->assertMatchesRegularExpression('/^REQ-\d{4}$/', $req->request_number);
        $this->assertSame('Pending', $req->status);
        $this->assertCount(2, $req->items);
        $this->assertCount(1, $req->approvals);

        // Approver melihat antrean
        $this->actingAs($approver)->get('/asset-request-approvals')->assertOk()->assertInertia(
            fn ($page) => $page->component('Dashboard/GA/AssetRequestApproval/Index')
        );

        $approval = $req->approvals()->first();

        // TTD wajib -> tanpa signature gagal validasi
        $this->actingAs($approver)
            ->patch("/asset-request-approvals/{$approval->id}", ['status' => 'Approved'])
            ->assertSessionHasErrors('signature');

        // Setujui dengan TTD -> pengajuan Approved
        $this->actingAs($approver)
            ->patch("/asset-request-approvals/{$approval->id}", [
                'status' => 'Approved',
                'signature' => 'data:image/png;base64,AAAA',
                'notes' => 'Disetujui',
            ])->assertRedirect();

        $this->assertSame('Approved', $approval->fresh()->status);
        $this->assertNotNull($approval->fresh()->signature);
        $this->assertSame('Approved', $req->fresh()->status);
    }

    public function test_asset_category_crud(): void
    {
        $user = $this->admin();

        // Create
        $this->actingAs($user)->post('/asset-categories', [
            'name' => 'Elektronik Test',
            'description' => 'Kategori uji',
        ])->assertRedirect();

        $cat = \App\Models\AssetCategory::where('name', 'Elektronik Test')->firstOrFail();

        // Update
        $this->actingAs($user)->put("/asset-categories/{$cat->id}", [
            'name' => 'Elektronik Updated',
            'description' => 'Diubah',
        ])->assertRedirect();
        $this->assertSame('Elektronik Updated', $cat->fresh()->name);

        // Delete
        $this->actingAs($user)->delete("/asset-categories/{$cat->id}")->assertRedirect();
        $this->assertDatabaseMissing('asset_categories', ['id' => $cat->id]);
    }

    public function test_ga_menu_and_permissions_are_seeded(): void
    {
        // Semua 24 route GA terdaftar & ter-assign ke 4 role GA.
        $names = [
            'asset-categories.index','asset-categories.store','asset-categories.update','asset-categories.destroy',
            'assets.index','assets.create','assets.store','assets.show','assets.edit','assets.update','assets.destroy',
            'asset-assignments.index','asset-assignments.store','asset-assignments.return',
            'asset-services.index','asset-services.store','asset-services.update',
            'asset-requests.index','asset-requests.create','asset-requests.store','asset-requests.show','asset-requests.cancel',
            'asset-request-approvals.index','asset-request-approvals.update',
        ];
        $routes = \App\Models\Route::whereIn('route_name', $names)->get();
        $this->assertCount(count($names), $routes, 'Ada route GA yang belum terdaftar.');

        foreach (['Web Dev', 'Admin GA', 'Manager GA', 'Supervisor GA'] as $rn) {
            $role = \App\Models\Role::where('name', $rn)->firstOrFail();
            $count = \App\Models\RolePermission::where('role_id', $role->id)
                ->whereIn('route_id', $routes->pluck('id'))
                ->count();
            $this->assertSame(count($names), $count, "Permission GA untuk role {$rn} belum lengkap.");
        }

        // Menu GA: dropdown "Manajemen Barang" berisi 5 submenu
        // (Pengajuan Barang sudah pindah ke section Formulir -> Daftar Formulir).
        $section = \App\Models\DashboardMenuSection::where('name', 'GA')->firstOrFail();
        $parent = \App\Models\DashboardMenu::where('section_id', $section->id)
            ->where('name', 'Manajemen Barang')->firstOrFail();
        $children = \App\Models\DashboardMenu::where('parent_id', $parent->id)->orderBy('position')->get();
        $this->assertCount(5, $children);
        $this->assertSame(
            ['Daftar Barang', 'Kategori Barang', 'Penempatan Barang', 'Service Barang', 'Approval Barang'],
            $children->pluck('name')->all()
        );

        // "Pengajuan Barang" ada di section Formulir -> dropdown "Daftar Formulir".
        $formSection = \App\Models\DashboardMenuSection::where('name', 'Formulir')->firstOrFail();
        $formDropdown = \App\Models\DashboardMenu::where('section_id', $formSection->id)
            ->where('name', 'Daftar Formulir')->firstOrFail();
        $formChildren = \App\Models\DashboardMenu::where('parent_id', $formDropdown->id)
            ->orderBy('position')->pluck('name')->all();
        $this->assertContains('Pengajuan Barang', $formChildren);
    }
}
