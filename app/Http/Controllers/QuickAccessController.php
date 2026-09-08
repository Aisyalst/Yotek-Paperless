<?php

namespace App\Http\Controllers;

use App\Models\QuickAccess;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuickAccessController extends Controller
{
    public function index()
    {
        $quickAccesses = QuickAccess::orderBy('sort_order')->get();
        return Inertia::render('Dashboard/Setting/QuickAccess/Index', [
            'quickAccesses' => $quickAccesses
        ]);
    }

    public function create()
    {
        $routes = \App\Models\Route::orderBy('name')->get();
        return Inertia::render('Dashboard/Setting/QuickAccess/Create', [
            'appRoutes' => $routes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'logo' => 'required|string|max:255',
            'url' => 'required|string|max:255',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'logo.required' => 'Logo ikon wajib diisi.',
            'url.required' => 'URL wajib diisi.',
        ]);

        $maxSort = QuickAccess::max('sort_order');

        QuickAccess::create([
            'title' => $request->title,
            'logo' => $request->logo,
            'url' => $request->url,
            'sort_order' => $maxSort !== null ? $maxSort + 1 : 0,
        ]);

        return redirect()->route('quick-accesses.index')->with('success', 'Akses Cepat berhasil ditambahkan.');
    }

    public function edit(QuickAccess $quickAccess)
    {
        $routes = \App\Models\Route::orderBy('name')->get();
        return Inertia::render('Dashboard/Setting/QuickAccess/Edit', [
            'quickAccess' => $quickAccess,
            'appRoutes' => $routes
        ]);
    }

    public function update(Request $request, QuickAccess $quickAccess)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'logo' => 'required|string|max:255',
            'url' => 'required|string|max:255',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'logo.required' => 'Logo ikon wajib diisi.',
            'url.required' => 'URL wajib diisi.',
        ]);

        $quickAccess->update([
            'title' => $request->title,
            'logo' => $request->logo,
            'url' => $request->url,
        ]);

        return redirect()->route('quick-accesses.index')->with('success', 'Akses Cepat berhasil diperbarui.');
    }

    public function destroy(QuickAccess $quickAccess)
    {
        $quickAccess->delete();
        return redirect()->back()->with('success', 'Akses Cepat berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:quick_accesses,id',
        ]);

        foreach ($request->ids as $index => $id) {
            QuickAccess::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Urutan berhasil diperbarui.');
    }
}
