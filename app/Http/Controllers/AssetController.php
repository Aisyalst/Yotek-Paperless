<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AssetController extends Controller
{
    /**
     * Daftar barang/aset dengan filter: pencarian, perusahaan, kategori, status.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $companyId = $request->query('company_id');
        $categoryId = $request->query('asset_category_id');
        $status = $request->query('status');
        $perPage = $request->query('per_page', 10);

        $query = Asset::with(['category', 'company', 'currentAssignment.employee'])
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('asset_code', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        if ($companyId) {
            $query->where('company_id', $companyId);
        }

        if ($categoryId) {
            $query->where('asset_category_id', $categoryId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $assets = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/GA/Asset/Index', [
            'assets' => $assets,
            'companies' => Company::select('id', 'name')->orderBy('name')->get(),
            'categories' => AssetCategory::select('id', 'name')->orderBy('order')->get(),
            'filters' => [
                'search' => $search,
                'company_id' => $companyId,
                'asset_category_id' => $categoryId,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/GA/Asset/Create', [
            'companies' => Company::select('id', 'name')->orderBy('name')->get(),
            'categories' => AssetCategory::select('id', 'name')->orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'asset_category_id' => 'nullable|exists:asset_categories,id',
            'company_id' => 'nullable|exists:companies,id',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'condition' => 'required|string|in:Baik,Rusak Ringan,Rusak Berat',
            'status' => 'required|string|in:Tersedia,Dipegang,Service,Rusak,Dihapuskan',
            'location' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'notes' => 'nullable|string',
        ]);

        $validated['asset_code'] = $this->generateAssetCode();
        $validated['qr_token'] = (string) Str::uuid();

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('asset_photos', 'public');
        }

        Asset::create($validated);

        return redirect()->route('assets.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    public function show(Asset $asset)
    {
        $asset->load([
            'category',
            'company',
            'assignments.employee',
            'assignments.assignedBy',
            'services',
            'currentAssignment.employee',
        ]);

        // QR code di-generate server-side (SVG, tanpa butuh GD/Imagick).
        $qrPayload = json_encode([
            'code' => $asset->asset_code,
            'token' => $asset->qr_token,
            'name' => $asset->name,
            'company' => $asset->company?->name,
        ]);
        $qrSvg = (string) QrCode::format('svg')
            ->size(220)
            ->margin(1)
            ->errorCorrection('M')
            ->generate($qrPayload);

        // Buang deklarasi XML di awal agar bisa disisipkan inline di HTML.
        $qrSvg = trim(preg_replace('/<\?xml.*?\?>/s', '', $qrSvg));

        return Inertia::render('Dashboard/GA/Asset/Show', [
            'asset' => $asset,
            'qr_svg' => $qrSvg,
        ]);
    }

    public function edit(Asset $asset)
    {
        return Inertia::render('Dashboard/GA/Asset/Edit', [
            'asset' => $asset,
            'companies' => Company::select('id', 'name')->orderBy('name')->get(),
            'categories' => AssetCategory::select('id', 'name')->orderBy('order')->get(),
        ]);
    }

    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'asset_category_id' => 'nullable|exists:asset_categories,id',
            'company_id' => 'nullable|exists:companies,id',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'purchase_date' => 'nullable|date',
            'purchase_price' => 'nullable|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'condition' => 'required|string|in:Baik,Rusak Ringan,Rusak Berat',
            'status' => 'required|string|in:Tersedia,Dipegang,Service,Rusak,Dihapuskan',
            'location' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($asset->photo) {
                Storage::disk('public')->delete($asset->photo);
            }
            $validated['photo'] = $request->file('photo')->store('asset_photos', 'public');
        }

        $asset->update($validated);

        return redirect()->route('assets.index')->with('success', 'Barang berhasil diperbarui.');
    }

    public function destroy(Asset $asset)
    {
        if ($asset->currentAssignment()->exists()) {
            return back()->with('error', 'Barang tidak bisa dihapus karena sedang dipegang. Kembalikan dulu barangnya.');
        }

        if ($asset->photo) {
            Storage::disk('public')->delete($asset->photo);
        }

        $asset->delete();

        return redirect()->route('assets.index')->with('success', 'Barang berhasil dihapus.');
    }

    /**
     * Buat kode aset otomatis berurutan: AST-0001, AST-0002, dst.
     */
    private function generateAssetCode(): string
    {
        $last = Asset::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        do {
            $code = 'AST-' . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
            $next++;
        } while (Asset::where('asset_code', $code)->exists());

        return $code;
    }
}
