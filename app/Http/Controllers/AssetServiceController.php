<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetService;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetServiceController extends Controller
{
    /**
     * Daftar tiket service barang. Filter: status, pencarian.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $perPage = $request->query('per_page', 10);

        $query = AssetService::with(['asset.company', 'asset.category', 'createdBy'])
            ->latest('service_date');

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('service_number', 'like', "%{$search}%")
                    ->orWhere('vendor', 'like', "%{$search}%")
                    ->orWhereHas('asset', function ($a) use ($search) {
                        $a->where('name', 'like', "%{$search}%")
                            ->orWhere('asset_code', 'like', "%{$search}%");
                    });
            });
        }

        $services = $query->paginate($perPage)->withQueryString();

        // Barang yang bisa dikirim service (tidak sedang dipegang & belum dihapuskan).
        $availableAssets = Asset::whereNotIn('status', ['Dihapuskan'])
            ->orderBy('name')
            ->get(['id', 'asset_code', 'name', 'status']);

        return Inertia::render('Dashboard/GA/AssetService/Index', [
            'services' => $services,
            'availableAssets' => $availableAssets,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Buat tiket service baru. Barang otomatis berstatus "Service".
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'service_type' => 'required|string|in:Preventive,Corrective,Perbaikan',
            'service_date' => 'required|date',
            'vendor' => 'nullable|string|max:255',
            'complaint' => 'nullable|string',
            'start_date' => 'nullable|date',
            'cost' => 'nullable|numeric|min:0',
        ]);

        $asset = Asset::findOrFail($validated['asset_id']);

        DB::transaction(function () use ($validated, $asset, $request) {
            AssetService::create([
                'asset_id' => $asset->id,
                'service_number' => $this->generateServiceNumber(),
                'service_type' => $validated['service_type'],
                'service_date' => $validated['service_date'],
                'vendor' => $validated['vendor'] ?? null,
                'complaint' => $validated['complaint'] ?? null,
                'start_date' => $validated['start_date'] ?? null,
                'cost' => $validated['cost'] ?? null,
                'status' => 'Diajukan',
                'created_by_nik' => $request->user()?->nik,
            ]);

            // Barang sedang diservice -> tidak tersedia.
            $asset->update(['status' => 'Service']);
        });

        // Notifikasi ke pemegang barang (jika ada) bahwa barangnya masuk service.
        $holder = $asset->currentAssignment?->employee_nik;
        if ($holder) {
            $user = User::where('nik', $holder)->first();
            if ($user) {
                app(NotificationService::class)->send([
                    'title' => 'Barang Masuk Service',
                    'body' => "Barang {$asset->name} ({$asset->asset_code}) sedang dalam proses service.",
                    'type' => 'info',
                    'url' => route('assets.show', $asset->id),
                    'target_type' => 'user',
                    'target_value' => (string) $user->id,
                    'created_by' => $request->user()?->id,
                ]);
            }
        }

        return redirect()->route('asset-services.index')->with('success', 'Tiket service berhasil dibuat.');
    }

    /**
     * Perbarui status/progress tiket service (Proses / Selesai / Batal).
     */
    public function update(Request $request, AssetService $assetService)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Proses,Selesai,Batal',
            'action_taken' => 'nullable|string',
            'completed_date' => 'nullable|date',
            'cost' => 'nullable|numeric|min:0',
            'result' => 'nullable|string',
        ]);

        DB::transaction(function () use ($assetService, $validated, $request) {
            $assetService->update([
                'status' => $validated['status'],
                'action_taken' => $validated['action_taken'] ?? $assetService->action_taken,
                'completed_date' => $validated['status'] === 'Selesai'
                    ? ($validated['completed_date'] ?? now()->toDateString())
                    : $assetService->completed_date,
                'cost' => $validated['cost'] ?? $assetService->cost,
                'result' => $validated['result'] ?? $assetService->result,
            ]);

            $asset = $assetService->asset;

            if ($validated['status'] === 'Selesai') {
                // Barang kembali tersedia.
                $asset->update(['status' => 'Tersedia']);
            } elseif ($validated['status'] === 'Batal') {
                $asset->update(['status' => 'Tersedia']);
            } elseif ($validated['status'] === 'Proses') {
                $asset->update(['status' => 'Service']);
            }

            // Notifikasi saat service selesai / batal ke pembuat tiket.
            if (in_array($validated['status'], ['Selesai', 'Batal'])) {
                $label = $validated['status'] === 'Selesai' ? 'selesai' : 'dibatalkan';
                app(NotificationService::class)->send([
                    'title' => 'Service Barang '.$validated['status'],
                    'body' => "Service barang {$asset->name} ({$asset->asset_code}) telah {$label}.",
                    'type' => 'info',
                    'url' => route('assets.show', $asset->id),
                    'target_type' => 'role',
                    'target_value' => 'Admin GA',
                    'created_by' => $request->user()?->id,
                ]);
            }
        });

        return redirect()->route('asset-services.index')->with('success', 'Status service berhasil diperbarui.');
    }

    /**
     * Nomor tiket service otomatis: SVC-0001, SVC-0002, dst.
     */
    private function generateServiceNumber(): string
    {
        $last = AssetService::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        do {
            $number = 'SVC-'.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
            $next++;
        } while (AssetService::where('service_number', $number)->exists());

        return $number;
    }
}
