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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ], [
            'image.required' => 'Gambar album wajib diunggah.',
            'image.image' => 'File harus berupa gambar.',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('company_albums', 'public');
            CompanyAlbum::create([
                'image' => $imagePath,
            ]);
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
