<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\Company;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetAssignmentController extends Controller
{
    /**
     * Daftar penempatan barang (pemegang). Filter: status, perusahaan, pencarian.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $companyId = $request->query('company_id');
        $status = $request->query('status', 'Aktif');
        $perPage = $request->query('per_page', 10);

        $query = AssetAssignment::with(['asset.category', 'asset.company', 'employee'])
            ->latest('assigned_date');

        if ($status) {
            $query->where('status', $status);
        }

        if ($companyId) {
            $query->whereHas('asset', fn ($q) => $q->where('company_id', $companyId));
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('employee_nik', 'like', "%{$search}%")
                    ->orWhereHas('asset', function ($a) use ($search) {
                        $a->where('name', 'like', "%{$search}%")
                            ->orWhere('asset_code', 'like', "%{$search}%");
                    })
                    ->orWhereHas('employee', function ($e) use ($search) {
                        $e->whereHas('personalInformation', fn ($p) => $p->where('full_name', 'like', "%{$search}%"));
                    });
            });
        }

        $assignments = $query->paginate($perPage)->withQueryString();

        // Barang yang bisa diserahkan (tidak sedang dipegang & tidak rusak/dihapuskan).
        $availableAssets = Asset::whereNotIn('status', ['Dipegang', 'Dihapuskan'])
            ->orderBy('name')
            ->get(['id', 'asset_code', 'name', 'status']);

        return Inertia::render('Dashboard/GA/AssetAssignment/Index', [
            'assignments' => $assignments,
            'availableAssets' => $availableAssets,
            'employees' => User::whereNotNull('nik')->orderBy('name')->get(['id', 'nik', 'name']),
            'companies' => Company::select('id', 'name')->orderBy('name')->get(),
            'filters' => [
                'search' => $search,
                'company_id' => $companyId,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Serahkan barang ke seorang karyawan (via NIK).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'employee_nik' => 'required|exists:users,nik',
            'assigned_date' => 'required|date',
            'condition_on_assign' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $asset = Asset::findOrFail($validated['asset_id']);

        // Barang tidak boleh sedang dipegang siapa pun.
        if ($asset->currentAssignment()->exists()) {
            return back()->with('error', 'Barang ini sedang dipegang. Kembalikan dulu sebelum diserahkan ke orang lain.');
        }

        DB::transaction(function () use ($validated, $asset, $request) {
            AssetAssignment::create([
                'asset_id' => $asset->id,
                'employee_nik' => $validated['employee_nik'],
                'assigned_date' => $validated['assigned_date'],
                'condition_on_assign' => $validated['condition_on_assign'] ?? $asset->condition,
                'status' => 'Aktif',
                'assigned_by_nik' => $request->user()?->nik,
                'notes' => $validated['notes'] ?? null,
            ]);

            $asset->update(['status' => 'Dipegang']);
        });

        // Notifikasi ke penerima barang.
        $receiver = User::where('nik', $validated['employee_nik'])->first();
        if ($receiver) {
            app(NotificationService::class)->send([
                'title' => 'Barang Diserahkan',
                'body' => "Barang {$asset->name} ({$asset->asset_code}) telah diserahkan kepada Anda.",
                'type' => 'info',
                'url' => route('assets.show', $asset->id),
                'target_type' => 'user',
                'target_value' => (string) $receiver->id,
                'created_by' => $request->user()?->id,
            ]);
        }

        return redirect()->route('asset-assignments.index')->with('success', 'Barang berhasil diserahkan.');
    }

    /**
     * Kembalikan barang dari pemegang saat ini.
     */
    public function returnAsset(Request $request, AssetAssignment $assetAssignment)
    {
        if ($assetAssignment->status !== 'Aktif') {
            return back()->with('error', 'Penempatan ini sudah dikembalikan sebelumnya.');
        }

        $validated = $request->validate([
            'returned_date' => 'required|date',
            'condition_on_return' => 'required|string|in:Baik,Rusak Ringan,Rusak Berat',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($assetAssignment, $validated, $request) {
            $assetAssignment->update([
                'returned_date' => $validated['returned_date'],
                'condition_on_return' => $validated['condition_on_return'],
                'status' => 'Dikembalikan',
                'notes' => $validated['notes'] ?? $assetAssignment->notes,
            ]);

            // Status barang menyesuaikan kondisi saat kembali.
            $asset = $assetAssignment->asset;
            $newStatus = match ($validated['condition_on_return']) {
                'Baik' => 'Tersedia',
                'Rusak Ringan' => 'Rusak',
                'Rusak Berat' => 'Rusak',
                default => 'Tersedia',
            };

            $asset->update([
                'status' => $newStatus,
                'condition' => $validated['condition_on_return'],
            ]);

            // Notifikasi ke pemegang sebelumnya.
            $holder = User::where('nik', $assetAssignment->employee_nik)->first();
            if ($holder) {
                app(NotificationService::class)->send([
                    'title' => 'Barang Dikembalikan',
                    'body' => "Barang {$asset->name} ({$asset->asset_code}) telah dikembalikan. Kondisi: {$validated['condition_on_return']}.",
                    'type' => 'info',
                    'url' => route('assets.show', $asset->id),
                    'target_type' => 'user',
                    'target_value' => (string) $holder->id,
                    'created_by' => $request->user()?->id,
                ]);
            }
        });

        return redirect()->route('asset-assignments.index')->with('success', 'Barang berhasil dikembalikan.');
    }
}
