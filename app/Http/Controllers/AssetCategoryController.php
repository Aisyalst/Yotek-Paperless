<?php

namespace App\Http\Controllers;

use App\Models\AssetCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetCategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = AssetCategory::withCount('assets')->orderBy('order');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/GA/AssetCategory/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:asset_categories,name',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['order'] = $validated['order'] ?? 0;
        $validated['is_active'] = $request->boolean('is_active', true);

        AssetCategory::create($validated);

        return back()->with('success', 'Kategori barang berhasil ditambahkan.');
    }

    public function update(Request $request, AssetCategory $assetCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:asset_categories,name,' . $assetCategory->id,
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['order'] = $validated['order'] ?? 0;
        $validated['is_active'] = $request->boolean('is_active', true);

        $assetCategory->update($validated);

        return back()->with('success', 'Kategori barang berhasil diperbarui.');
    }

    public function destroy(AssetCategory $assetCategory)
    {
        if ($assetCategory->assets()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih dipakai oleh barang.');
        }

        $assetCategory->delete();

        return back()->with('success', 'Kategori barang berhasil dihapus.');
    }
}
