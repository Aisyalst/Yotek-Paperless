<?php

namespace App\Http\Controllers;

use App\Models\Urgency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UrgencyController extends Controller
{
    public function index()
    {
        $urgencies = Urgency::orderBy('level')->get();
        return Inertia::render('Dashboard/Master/Urgency/Index', [
            'urgencies' => $urgencies
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Master/Urgency/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:urgencies,title',
            'level' => 'required|integer|min:1',
            'color' => 'nullable|string|max:255',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'title.string' => 'Judul harus berupa string.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'title.unique' => 'Judul sudah digunakan.',
            'level.required' => 'Level wajib diisi.',
            'level.integer' => 'Level harus berupa angka.',
            'level.min' => 'Level minimal 1.',
            'color.string' => 'Warna harus berupa string.',
            'color.max' => 'Warna maksimal 255 karakter.',
        ]);

        Urgency::create([
            'title' => $request->title,
            'level' => $request->level,
            'color' => $request->color,
        ]);

        return redirect()->route('urgencies.index')->with('success', 'Urgensi berhasil ditambahkan.');
    }

    public function edit(Urgency $urgency)
    {
        return Inertia::render('Dashboard/Master/Urgency/Edit', [
            'urgency' => $urgency,
        ]);
    }

    public function update(Request $request, Urgency $urgency)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:urgencies,title,' . $urgency->id,
            'level' => 'required|integer|min:1',
            'color' => 'nullable|string|max:255',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'title.string' => 'Judul harus berupa string.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'title.unique' => 'Judul sudah digunakan.',
            'level.required' => 'Level wajib diisi.',
            'level.integer' => 'Level harus berupa angka.',
            'level.min' => 'Level minimal 1.',
            'color.string' => 'Warna harus berupa string.',
            'color.max' => 'Warna maksimal 255 karakter.',
        ]);

        $urgency->update([
            'title' => $request->title,
            'level' => $request->level,
            'color' => $request->color,
        ]);

        return redirect()->route('urgencies.index')->with('success', 'Urgensi berhasil diperbarui.');
    }

    public function destroy(Urgency $urgency)
    {
        $urgency->delete();
        return redirect()->route('urgencies.index')->with('success', 'Urgensi berhasil dihapus.');
    }
}
