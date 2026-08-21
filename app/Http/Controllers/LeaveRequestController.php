<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        // For now, load all requests with their user data. 
        // In the future, this might be filtered by role (e.g. employee sees their own, HR sees all).
        $leaveRequests = LeaveRequest::with('user.employeeInformation')->orderBy('created_at', 'desc')->get();

        return Inertia::render('LeaveRequest/Index', [
            'leaveRequests' => $leaveRequests
        ]);
    }

    public function create(Request $request)
    {
        $user = clone $request->user();
        $user->load(['employeeInformation']);

        return Inertia::render('LeaveRequest/Create', [
            'userData' => $user
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_type' => 'required|in:Sakit,Izin,Cuti,Cuti Khusus',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'duration_days' => 'nullable|integer|min:1',
            'has_doctor_note' => 'nullable|boolean',
            'permission_type' => 'nullable|string',
            'permission_start_time' => 'nullable|date_format:H:i',
            'permission_end_time' => 'nullable|date_format:H:i|after:permission_start_time',
            'deduction_type' => 'nullable|string|in:Potong Gaji,Potong Cuti',
            'special_leave_type' => 'nullable|string',
            'reason' => 'nullable|string',
            'work_delegation' => 'nullable|string',
        ], [
            'request_type.required' => 'Jenis pengajuan wajib diisi.',
            'request_type.in' => 'Jenis pengajuan tidak valid.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'end_date.date' => 'Format tanggal selesai tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'duration_days.integer' => 'Lama hari harus berupa angka.',
            'duration_days.min' => 'Lama hari minimal 1.',
            'permission_start_time.date_format' => 'Format jam mulai tidak valid (HH:MM).',
            'permission_end_time.date_format' => 'Format jam selesai tidak valid (HH:MM).',
            'permission_end_time.after' => 'Jam selesai harus setelah jam mulai.',
            'deduction_type.in' => 'Pilihan potong gaji/cuti tidak valid.'
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['request_date'] = now()->toDateString();
        $validated['status'] = 'Pending';

        LeaveRequest::create($validated);

        return redirect()->route('leave-requests.index')->with('success', 'Pengajuan berhasil dikirim.');
    }
}
