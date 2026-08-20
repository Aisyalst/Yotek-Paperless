<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatusController extends Controller
{
    public function index()
    {
        $statuses = Status::orderBy('title')->get();
        return Inertia::render('Dashboard/Master/Status/Index', [
            'statuses' => $statuses
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Master/Status/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:Form,Kontrak',
            'color' => 'nullable|string|max:255',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'title.string' => 'Judul harus berupa string.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'type.required' => 'Tipe wajib diisi.',
            'type.in' => 'Tipe tidak valid.',
            'color.string' => 'Warna harus berupa string.',
            'color.max' => 'Warna maksimal 255 karakter.',
        ]);

        Status::create([
            'title' => $request->title,
            'type' => $request->type,
            'color' => $request->color,
        ]);

        return redirect()->route('statuses.index')->with('success', 'Status berhasil ditambahkan.');
    }

    public function edit(Status $status)
    {
        return Inertia::render('Dashboard/Master/Status/Edit', [
            'status' => $status,
        ]);
    }

    public function update(Request $request, Status $status)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:Form,Kontrak',
            'color' => 'nullable|string|max:255',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'title.string' => 'Judul harus berupa string.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'type.required' => 'Tipe wajib diisi.',
            'type.in' => 'Tipe tidak valid.',
            'color.string' => 'Warna harus berupa string.',
            'color.max' => 'Warna maksimal 255 karakter.',
        ]);

        $status->update([
            'title' => $request->title,
            'type' => $request->type,
            'color' => $request->color,
        ]);

        return redirect()->route('statuses.index')->with('success', 'Status berhasil diperbarui.');
    }

    public function destroy(Status $status)
    {
        $status->delete();
        return redirect()->route('statuses.index')->with('success', 'Status berhasil dihapus.');
    }
}
