<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('sort_order')->get();
        return Inertia::render('Dashboard/Setting/Banner/Index', [
            'banners' => $banners
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Setting/Banner/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'banner' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'banner.required' => 'Gambar banner wajib diunggah.',
            'banner.image' => 'File harus berupa gambar.',
        ]);

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('banners', 'public');
        }

        $maxSort = Banner::max('sort_order');

        Banner::create([
            'title' => $request->title,
            'banner' => $bannerPath,
            'sort_order' => $maxSort !== null ? $maxSort + 1 : 0,
        ]);

        return redirect()->route('banners.index')->with('success', 'Banner berhasil ditambahkan.');
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('Dashboard/Setting/Banner/Edit', [
            'banner' => $banner
        ]);
    }

    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'banner.image' => 'File harus berupa gambar.',
        ]);

        $data = ['title' => $request->title];

        if ($request->hasFile('banner')) {
            if ($banner->banner) {
                Storage::disk('public')->delete($banner->banner);
            }
            $data['banner'] = $request->file('banner')->store('banners', 'public');
        }

        $banner->update($data);

        return redirect()->route('banners.index')->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->banner) {
            Storage::disk('public')->delete($banner->banner);
        }
        $banner->delete();

        return redirect()->back()->with('success', 'Banner berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:banners,id',
        ]);

        foreach ($request->ids as $index => $id) {
            Banner::where('id', $id)->update(['sort_order' => $index]);
        }

        return redirect()->back()->with('success', 'Urutan berhasil diperbarui.');
    }
}
