<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingRoom;
use App\Models\User;
use App\Models\Role;
use App\Models\Devision;
use App\Models\EmployeeInformation;
use App\Models\MeetingParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MeetingController extends Controller
{
    public function index()
    {
        $meetings = Meeting::with(['room', 'organizer', 'participants.employee'])
            ->orderBy('start_time', 'desc')
            ->get();
            
        return Inertia::render('Dashboard/Meeting/Index', [
            'meetings' => $meetings
        ]);
    }

    public function create()
    {
        $rooms = MeetingRoom::where('is_active', true)->get();
        $divisions = Devision::orderBy('name')->get();
        $roles = Role::orderBy('name')->get();
        $employees = User::with('employeeInformation')->where('is_active', true)->get();

        return Inertia::render('Dashboard/Meeting/Create', [
            'rooms' => $rooms,
            'divisions' => $divisions,
            'roles' => $roles,
            'employees' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:online,on_room,hybrid',
            'meeting_room_id' => 'nullable|required_if:type,on_room,hybrid|exists:meeting_rooms,id',
            'online_platform' => 'nullable|required_if:type,online,hybrid|in:Zoom,Google Meet,Ms Teams,other',
            'online_link' => 'nullable|required_if:type,online,hybrid|string',
            'passcode' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'divisions' => 'nullable|array',
            'roles' => 'nullable|array',
            'employees' => 'nullable|array',
        ], [
            'title.required' => 'Judul meeting wajib diisi.',
            'type.required' => 'Tipe meeting wajib dipilih.',
            'meeting_room_id.required_if' => 'Ruangan rapat wajib diisi untuk tipe on room atau hybrid.',
            'online_platform.required_if' => 'Platform online wajib diisi untuk tipe online atau hybrid.',
            'online_link.required_if' => 'Tautan online wajib diisi untuk tipe online atau hybrid.',
            'start_time.required' => 'Waktu mulai wajib diisi.',
            'end_time.required' => 'Waktu selesai wajib diisi.',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
        ]);

        DB::beginTransaction();

        try {
            $meeting = Meeting::create([
                'title' => $request->title,
                'description' => $request->description,
                'type' => $request->type,
                'meeting_room_id' => in_array($request->type, ['on_room', 'hybrid']) ? $request->meeting_room_id : null,
                'online_platform' => in_array($request->type, ['online', 'hybrid']) ? $request->online_platform : null,
                'online_link' => in_array($request->type, ['online', 'hybrid']) ? $request->online_link : null,
                'passcode' => $request->passcode,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'organizer_nik' => Auth::user()->nik,
                'status' => 'Terjadwal',
            ]);

            $participantNiks = [];

            if (!empty($request->divisions)) {
                $divisionNames = Devision::whereIn('id', $request->divisions)->pluck('name')->toArray();
                $niks = EmployeeInformation::whereIn('department', $divisionNames)->pluck('nik')->toArray();
                $participantNiks = array_merge($participantNiks, $niks);
            }

            if (!empty($request->roles)) {
                $niks = User::whereIn('role_id', $request->roles)->pluck('nik')->toArray();
                $participantNiks = array_merge($participantNiks, $niks);
            }

            if (!empty($request->employees)) {
                $participantNiks = array_merge($participantNiks, $request->employees);
            }

            $participantNiks = array_unique(array_filter($participantNiks));

            foreach ($participantNiks as $nik) {
                MeetingParticipant::create([
                    'meeting_id' => $meeting->id,
                    'employee_nik' => $nik,
                    'status' => 'pending',
                ]);
            }

            DB::commit();

            return redirect()->route('meetings.index')->with('success', 'Jadwal meeting berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan data meeting.'])->withInput();
        }
    }

    public function show(Meeting $meeting)
    {
        $meeting->load(['room', 'organizer', 'participants.employee.employeeInformation', 'participants.employee.role']);

        return Inertia::render('Dashboard/Meeting/Show', [
            'meeting' => $meeting
        ]);
    }

    public function edit(Meeting $meeting)
    {
        $rooms = MeetingRoom::where('is_active', true)->get();
        $divisions = Devision::orderBy('name')->get();
        $roles = Role::orderBy('name')->get();
        $employees = User::with('employeeInformation')->where('is_active', true)->get();

        $selectedEmployees = $meeting->participants()->pluck('employee_nik')->toArray();

        return Inertia::render('Dashboard/Meeting/Edit', [
            'meeting' => $meeting,
            'selectedEmployees' => $selectedEmployees,
            'rooms' => $rooms,
            'divisions' => $divisions,
            'roles' => $roles,
            'employees' => $employees,
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:online,on_room,hybrid',
            'meeting_room_id' => 'nullable|required_if:type,on_room,hybrid|exists:meeting_rooms,id',
            'online_platform' => 'nullable|required_if:type,online,hybrid|in:Zoom,Google Meet,Ms Teams,other',
            'online_link' => 'nullable|required_if:type,online,hybrid|string',
            'passcode' => 'nullable|string',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'status' => 'required|in:Terjadwal,Berjalan,Selesai,Dibatalkan',
            'divisions' => 'nullable|array',
            'roles' => 'nullable|array',
            'employees' => 'nullable|array',
        ], [
            'title.required' => 'Judul meeting wajib diisi.',
            'type.required' => 'Tipe meeting wajib dipilih.',
            'meeting_room_id.required_if' => 'Ruangan rapat wajib diisi untuk tipe on room atau hybrid.',
            'online_platform.required_if' => 'Platform online wajib diisi untuk tipe online atau hybrid.',
            'online_link.required_if' => 'Tautan online wajib diisi untuk tipe online atau hybrid.',
            'start_time.required' => 'Waktu mulai wajib diisi.',
            'end_time.required' => 'Waktu selesai wajib diisi.',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
        ]);

        DB::beginTransaction();

        try {
            $meeting->update([
                'title' => $request->title,
                'description' => $request->description,
                'type' => $request->type,
                'meeting_room_id' => in_array($request->type, ['on_room', 'hybrid']) ? $request->meeting_room_id : null,
                'online_platform' => in_array($request->type, ['online', 'hybrid']) ? $request->online_platform : null,
                'online_link' => in_array($request->type, ['online', 'hybrid']) ? $request->online_link : null,
                'passcode' => $request->passcode,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'status' => $request->status,
            ]);

            $participantNiks = [];

            if (!empty($request->divisions)) {
                $divisionNames = Devision::whereIn('id', $request->divisions)->pluck('name')->toArray();
                $niks = EmployeeInformation::whereIn('department', $divisionNames)->pluck('nik')->toArray();
                $participantNiks = array_merge($participantNiks, $niks);
            }

            if (!empty($request->roles)) {
                $niks = User::whereIn('role_id', $request->roles)->pluck('nik')->toArray();
                $participantNiks = array_merge($participantNiks, $niks);
            }

            if (!empty($request->employees)) {
                $participantNiks = array_merge($participantNiks, $request->employees);
            }

            $participantNiks = array_unique(array_filter($participantNiks));
            
            $existingNiks = $meeting->participants()->pluck('employee_nik')->toArray();
            $toDelete = array_diff($existingNiks, $participantNiks);
            $toAdd = array_diff($participantNiks, $existingNiks);

            if (!empty($toDelete)) {
                MeetingParticipant::where('meeting_id', $meeting->id)
                    ->whereIn('employee_nik', $toDelete)
                    ->delete();
            }

            foreach ($toAdd as $nik) {
                MeetingParticipant::create([
                    'meeting_id' => $meeting->id,
                    'employee_nik' => $nik,
                    'status' => 'pending',
                ]);
            }

            DB::commit();

            return redirect()->route('meetings.index')->with('success', 'Jadwal meeting berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui data meeting.'])->withInput();
        }
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();
        return redirect()->route('meetings.index')->with('success', 'Jadwal meeting berhasil dihapus.');
    }
}
