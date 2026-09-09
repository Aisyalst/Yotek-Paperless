<?php

namespace App\Http\Controllers;

use App\Models\LeaveEntitlement;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LeaveEntitlementController extends Controller
{
    public function index()
    {
        $leaveEntitlements = LeaveEntitlement::with('user.personalInformation')->latest()->get();
        return Inertia::render('Dashboard/HR/LeaveEntitlement/Index', [
            'leaveEntitlements' => $leaveEntitlements
        ]);
    }

    public function create()
    {
        $users = User::with('personalInformation')->get();
        return Inertia::render('Dashboard/HR/LeaveEntitlement/Create', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|exists:users,nik',
            'total' => 'required|integer|min:1',
            'duration' => 'required|string',
            'start_date' => 'required|date',
            'status' => 'required|string|in:Aktif,Hangus,Habis'
        ], [
            'nik.required' => 'Pengguna (NIK) wajib diisi.',
            'nik.exists' => 'Pengguna tidak ditemukan.',
            'total.required' => 'Total cuti wajib diisi.',
            'total.integer' => 'Total cuti harus berupa angka.',
            'total.min' => 'Total cuti minimal 1 hari.',
            'duration.required' => 'Durasi wajib diisi.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status tidak valid.'
        ]);

        $validated['end_date'] = $this->calculateEndDate($validated['start_date'], $validated['duration'])->format('Y-m-d');

        LeaveEntitlement::create($validated);

        return redirect()->route('leave-entitlements.index')->with('success', 'Hak Cuti berhasil ditambahkan.');
    }

    public function edit(LeaveEntitlement $leaveEntitlement)
    {
        $users = User::with('personalInformation')->get();
        return Inertia::render('Dashboard/HR/LeaveEntitlement/Edit', [
            'leaveEntitlement' => $leaveEntitlement,
            'users' => $users
        ]);
    }

    public function update(Request $request, LeaveEntitlement $leaveEntitlement)
    {
        $validated = $request->validate([
            'nik' => 'required|exists:users,nik',
            'total' => 'required|integer|min:1',
            'duration' => 'required|string',
            'start_date' => 'required|date',
            'status' => 'required|string|in:Aktif,Hangus,Habis'
        ], [
            'nik.required' => 'Pengguna (NIK) wajib diisi.',
            'nik.exists' => 'Pengguna tidak ditemukan.',
            'total.required' => 'Total cuti wajib diisi.',
            'total.integer' => 'Total cuti harus berupa angka.',
            'total.min' => 'Total cuti minimal 1 hari.',
            'duration.required' => 'Durasi wajib diisi.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Format tanggal mulai tidak valid.',
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status tidak valid.'
        ]);

        $validated['end_date'] = $this->calculateEndDate($validated['start_date'], $validated['duration'])->format('Y-m-d');

        $leaveEntitlement->update($validated);

        return redirect()->route('leave-entitlements.index')->with('success', 'Hak Cuti berhasil diperbarui.');
    }

    public function destroy(LeaveEntitlement $leaveEntitlement)
    {
        $leaveEntitlement->delete();

        return redirect()->route('leave-entitlements.index')->with('success', 'Hak Cuti berhasil dihapus.');
    }

    private function calculateEndDate($startDate, $duration)
    {
        $date = Carbon::parse($startDate);
        $duration = strtolower($duration);
        
        if (str_contains($duration, 'year')) {
            preg_match('/(\d+)\s*year/i', $duration, $matches);
            if (isset($matches[1])) {
                $date->addYears((int)$matches[1]);
            }
        }
        
        if (str_contains($duration, 'month')) {
            preg_match('/(\d+)\s*month/i', $duration, $matches);
            if (isset($matches[1])) {
                $date->addMonths((int)$matches[1]);
            }
        }
        
        // Usually an entitlement for 1 year starting Jan 1 ends Dec 31
        return $date->subDay();
    }
}
