<?php

namespace App\Http\Controllers;

use App\Models\MeetingRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingRoomController extends Controller
{
    public function index()
    {
        $meetingRooms = MeetingRoom::orderBy('name')->get();
        return Inertia::render('Dashboard/Master/MeetingRoom/Index', [
            'meetingRooms' => $meetingRooms
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Master/MeetingRoom/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Nama ruangan wajib diisi.',
            'name.string' => 'Nama ruangan harus berupa teks.',
            'name.max' => 'Nama ruangan maksimal 255 karakter.',
            'location.required' => 'Lokasi wajib diisi.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'capacity.required' => 'Kapasitas wajib diisi.',
            'capacity.integer' => 'Kapasitas harus berupa angka.',
            'capacity.min' => 'Kapasitas minimal 1.',
        ]);

        MeetingRoom::create([
            'name' => $request->name,
            'location' => $request->location,
            'capacity' => $request->capacity,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
        ]);

        return redirect()->route('meeting-rooms.index')->with('success', 'Ruangan rapat berhasil ditambahkan.');
    }

    public function edit(MeetingRoom $meetingRoom)
    {
        return Inertia::render('Dashboard/Master/MeetingRoom/Edit', [
            'meetingRoom' => $meetingRoom
        ]);
    }

    public function update(Request $request, MeetingRoom $meetingRoom)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Nama ruangan wajib diisi.',
            'name.string' => 'Nama ruangan harus berupa teks.',
            'name.max' => 'Nama ruangan maksimal 255 karakter.',
            'location.required' => 'Lokasi wajib diisi.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'capacity.required' => 'Kapasitas wajib diisi.',
            'capacity.integer' => 'Kapasitas harus berupa angka.',
            'capacity.min' => 'Kapasitas minimal 1.',
        ]);

        $meetingRoom->update([
            'name' => $request->name,
            'location' => $request->location,
            'capacity' => $request->capacity,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $meetingRoom->is_active,
        ]);

        return redirect()->route('meeting-rooms.index')->with('success', 'Ruangan rapat berhasil diperbarui.');
    }

    public function destroy(MeetingRoom $meetingRoom)
    {
        $meetingRoom->delete();
        return redirect()->route('meeting-rooms.index')->with('success', 'Ruangan rapat berhasil dihapus.');
    }
}
