<?php

namespace App\Http\Controllers;

use App\Models\AssetRequestApproval;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetRequestApprovalController extends Controller
{
    /**
     * Antrean approval pengajuan barang milik user yang login + riwayatnya.
     */
    public function index()
    {
        $user = Auth::user();

        $query = AssetRequestApproval::with([
            'request.items',
            'request.company',
            'request.employee.personalInformation',
            'approver.personalInformation',
        ]);

        if ($user && $user->nik) {
            $query->where('approver_nik', $user->nik);
        }

        $approvals = $query->get()->map(function ($approval) {
            $isMyTurn = false;

            if ($approval->status === 'Pending') {
                $pendingPrevious = AssetRequestApproval::where('asset_request_id', $approval->asset_request_id)
                    ->where('approver_level', '<', $approval->approver_level)
                    ->where('status', '!=', 'Approved')
                    ->exists();

                $isMyTurn = ! $pendingPrevious;
            }

            $approval->setAttribute('is_my_turn', $isMyTurn);

            return $approval;
        })->sortByDesc('id')->values();

        return Inertia::render('Dashboard/GA/AssetRequestApproval/Index', [
            'approvals' => $approvals,
        ]);
    }

    /**
     * Setujui / tolak sebuah level approval. Tanda tangan wajib diisi.
     */
    public function update(Request $request, AssetRequestApproval $assetRequestApproval)
    {
        $validated = $request->validate([
            'status' => 'required|in:Approved,Rejected',
            'signature' => 'required|string',
            'notes' => 'nullable|string',
        ], [
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status tidak valid.',
            'signature.required' => 'Tanda tangan wajib diisi.',
        ]);

        // Hanya approver yang bersangkutan (atau pemilik NIK) yang boleh bertindak.
        if (Auth::user()?->nik !== $assetRequestApproval->approver_nik) {
            abort(403, 'Anda bukan approver untuk pengajuan ini.');
        }

        if ($assetRequestApproval->status !== 'Pending') {
            return redirect()->back()->with('error', 'Approval ini sudah diproses.');
        }

        $assetRequest = $assetRequestApproval->request;

        DB::transaction(function () use ($validated, $assetRequestApproval, $assetRequest) {
            $assetRequestApproval->update([
                'status' => $validated['status'],
                'signature' => $validated['signature'],
                'notes' => $validated['notes'] ?? $assetRequestApproval->notes,
                'acted_at' => now(),
            ]);

            if ($validated['status'] === 'Rejected') {
                $assetRequest->update(['status' => 'Rejected']);

                // Level di atasnya otomatis ditolak.
                AssetRequestApproval::where('asset_request_id', $assetRequest->id)
                    ->where('approver_level', '>', $assetRequestApproval->approver_level)
                    ->where('status', 'Pending')
                    ->update(['status' => 'Auto Reject', 'notes' => 'Ditolak pada level sebelumnya.']);
            } else {
                $allApproved = ! AssetRequestApproval::where('asset_request_id', $assetRequest->id)
                    ->where('status', '!=', 'Approved')
                    ->exists();

                if ($allApproved) {
                    $assetRequest->update(['status' => 'Approved']);
                }
            }
        });

        $employeeUser = User::where('nik', $assetRequest->employee_nik)->first();

        if ($validated['status'] === 'Rejected') {
            if ($employeeUser) {
                app(NotificationService::class)->send([
                    'title' => 'Pengajuan Barang Ditolak',
                    'body' => 'Pengajuan barang Anda telah ditolak oleh '.(Auth::user()->name ?? 'approver').'.',
                    'type' => 'error',
                    'url' => route('asset-requests.show', $assetRequest->id),
                    'target_type' => 'user',
                    'target_value' => (string) $employeeUser->id,
                    'created_by' => null,
                ]);
            }
        } else {
            $allApproved = ! AssetRequestApproval::where('asset_request_id', $assetRequest->id)
                ->where('status', '!=', 'Approved')
                ->exists();

            if ($allApproved) {
                if ($employeeUser) {
                    app(NotificationService::class)->send([
                        'title' => 'Pengajuan Barang Disetujui',
                        'body' => 'Pengajuan barang Anda telah disetujui sepenuhnya.',
                        'type' => 'success',
                        'url' => route('asset-requests.show', $assetRequest->id),
                        'target_type' => 'user',
                        'target_value' => (string) $employeeUser->id,
                        'created_by' => null,
                    ]);
                }
            } else {
                // Beri tahu approver level berikutnya.
                $nextApproval = AssetRequestApproval::where('asset_request_id', $assetRequest->id)
                    ->where('approver_level', '>', $assetRequestApproval->approver_level)
                    ->orderBy('approver_level')
                    ->first();

                if ($nextApproval && $nextApproval->approver_nik) {
                    $nextUser = User::where('nik', $nextApproval->approver_nik)->first();
                    if ($nextUser) {
                        app(NotificationService::class)->send([
                            'title' => 'Pengajuan Barang Baru',
                            'body' => ($employeeUser->name ?? 'Karyawan').' mengajukan barang yang membutuhkan persetujuan Anda.',
                            'type' => 'info',
                            'url' => route('asset-request-approvals.index'),
                            'target_type' => 'user',
                            'target_value' => (string) $nextUser->id,
                            'created_by' => null,
                        ]);
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Keputusan approval berhasil disimpan.');
    }
}
