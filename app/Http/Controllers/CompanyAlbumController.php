<?php

namespace App\Http\Controllers;

use App\Models\CompanyAlbum;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CompanyAlbumController extends Controller
{
    public function index()
    {
        $albums = CompanyAlbum::latest()->get();
        return Inertia::render('Dashboard/Setting/CompanyAlbum/Index', [
            'albums' => $albums
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Setting/CompanyAlbum/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ], [
            'images.required' => 'Gambar album wajib diunggah.',
            'images.*.image' => 'File harus berupa gambar.',
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imagePath = $file->store('company_albums', 'public');
                CompanyAlbum::create([
                    'image' => $imagePath,
                ]);
            }
            return redirect()->route('company-albums.index')->with('success', 'Gambar album berhasil ditambahkan.');
        }

        return redirect()->route('company-albums.index')->withErrors('Gagal mengunggah gambar.');
    }

    public function destroy(CompanyAlbum $companyAlbum)
    {
        if ($companyAlbum->image) {
            Storage::disk('public')->delete($companyAlbum->image);
        }
        $companyAlbum->delete();

        return redirect()->back()->with('success', 'Gambar album berhasil dihapus.');
    }
}
