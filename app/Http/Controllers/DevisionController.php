<?php

namespace App\Http\Controllers;

use App\Models\Devision;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevisionController extends Controller
{
    public function index()
    {
        $devisions = Devision::orderBy('name')->get();
        return Inertia::render('Dashboard/Master/Devision/Index', [
            'devisions' => $devisions
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Master/Devision/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ], [
            'name.required' => 'Nama divisi wajib diisi.',
            'name.string' => 'Nama divisi harus berupa string.',
            'name.max' => 'Nama divisi maksimal 255 karakter.',
        ]);

        Devision::create([
            'name' => $request->name,
        ]);

        return redirect()->route('devisions.index')->with('success', 'Divisi berhasil ditambahkan.');
    }

    public function edit(Devision $devision)
    {
        return Inertia::render('Dashboard/Master/Devision/Edit', [
            'devision' => $devision,
        ]);
    }

    public function update(Request $request, Devision $devision)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ], [
            'name.required' => 'Nama divisi wajib diisi.',
            'name.string' => 'Nama divisi harus berupa string.',
            'name.max' => 'Nama divisi maksimal 255 karakter.',
        ]);

        $devision->update([
            'name' => $request->name,
        ]);

        return redirect()->route('devisions.index')->with('success', 'Divisi berhasil diperbarui.');
    }

    public function destroy(Devision $devision)
    {
        $devision->delete();
        return redirect()->route('devisions.index')->with('success', 'Divisi berhasil dihapus.');
    }
}
