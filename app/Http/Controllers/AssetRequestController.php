<?php

namespace App\Http\Controllers;

use App\Models\ApprovalWorkflow;
use App\Models\ApprovalWorkflowStep;
use App\Models\AssetCategory;
use App\Models\AssetRequest;
use App\Models\AssetRequestApproval;
use App\Models\Company;
use App\Models\EmployeeInformation;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetRequestController extends Controller
{
    /**
     * Daftar pengajuan barang (multi-item). Filter: status, prioritas, pencarian.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $priority = $request->query('priority');
        $perPage = $request->query('per_page', 10);

        $query = AssetRequest::with(['items', 'company', 'employee.personalInformation', 'approvals'])
            ->withCount('items')
            ->latest('request_date');

        if ($status) {
            $query->where('status', $status);
        }

        if ($priority) {
            $query->where('priority', $priority);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('request_number', 'like', "%{$search}%")
                    ->orWhere('employee_nik', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhereHas('employee', function ($e) use ($search) {
                        $e->whereHas('personalInformation', fn ($p) => $p->where('full_name', 'like', "%{$search}%"));
                    });
            });
        }

        $requests = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/GA/AssetRequest/Index', [
            'requests' => $requests,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'priority' => $priority,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Form pengajuan barang baru (multi-item).
     */
    public function create(Request $request)
    {
        $user = $request->user();
        $employee = EmployeeInformation::where('nik', $user?->nik)->first();

        return Inertia::render('Dashboard/GA/AssetRequest/Create', [
            'categories' => AssetCategory::where('is_active', true)->orderBy('order')->get(['id', 'name']),
            'companies' => Company::select('id', 'name')->orderBy('name')->get(),
            'defaults' => [
                'employee_nik' => $user?->nik,
                'employee_name' => $employee?->employee_name ?? $user?->name,
                'department' => $employee?->department,
                'company' => $employee?->company,
            ],
        ]);
    }

    /**
     * Simpan pengajuan baru + item + generate approval bertingkat.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_date' => 'required|date',
            'needed_date' => 'nullable|date|after_or_equal:request_date',
            'company_id' => 'nullable|exists:companies,id',
            'department' => 'nullable|string|max:255',
            'purpose' => 'nullable|string',
            'priority' => 'required|string|in:Rendah,Normal,Tinggi,Urgent',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.asset_category_id' => 'nullable|exists:asset_categories,id',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.estimated_price' => 'nullable|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ], [
            'request_date.required' => 'Tanggal pengajuan wajib diisi.',
            'priority.required' => 'Prioritas wajib dipilih.',
            'items.required' => 'Minimal satu item harus diisi.',
            'items.min' => 'Minimal satu item harus diisi.',
            'items.*.item_name.required' => 'Nama item wajib diisi.',
            'items.*.qty.required' => 'Jumlah item wajib diisi.',
            'items.*.qty.min' => 'Jumlah item minimal 1.',
        ]);

        $user = $request->user();

        $assetRequest = DB::transaction(function () use ($validated, $user) {
            $assetRequest = AssetRequest::create([
                'request_number' => $this->generateRequestNumber(),
                'employee_nik' => $user->nik,
                'company_id' => $validated['company_id'] ?? null,
                'department' => $validated['department'] ?? null,
                'request_date' => $validated['request_date'],
                'needed_date' => $validated['needed_date'] ?? null,
                'purpose' => $validated['purpose'] ?? null,
                'priority' => $validated['priority'],
                'status' => 'Pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $assetRequest->items()->create([
                    'asset_category_id' => $item['asset_category_id'] ?? null,
                    'item_name' => $item['item_name'],
                    'qty' => $item['qty'],
                    'unit' => $item['unit'] ?? null,
                    'estimated_price' => $item['estimated_price'] ?? null,
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            $this->createApprovals($assetRequest, $user);

            return $assetRequest;
        });

        // Notifikasi ke approver level pertama.
        $firstApproval = $assetRequest->approvals()->orderBy('approver_level')->first();
        if ($firstApproval && $firstApproval->approver_nik && $firstApproval->approver_nik !== $user->nik) {
            $approverUser = User::where('nik', $firstApproval->approver_nik)->first();
            if ($approverUser) {
                app(NotificationService::class)->send([
                    'title' => 'Pengajuan Barang Baru',
                    'body' => ($user->name ?? 'Karyawan').' mengajukan barang yang membutuhkan persetujuan Anda.',
                    'type' => 'info',
                    'url' => route('asset-request-approvals.index'),
                    'target_type' => 'user',
                    'target_value' => (string) $approverUser->id,
                    'created_by' => $user->id,
                ]);
            }
        }

        return redirect()->route('asset-requests.index')->with('success', 'Pengajuan barang berhasil dikirim.');
    }

    /**
     * Detail pengajuan + item + riwayat approval.
     */
    public function show(AssetRequest $assetRequest)
    {
        $assetRequest->load([
            'items.category',
            'company',
            'employee.personalInformation',
            'approvals.approver.personalInformation',
        ]);

        return Inertia::render('Dashboard/GA/AssetRequest/Show', [
            'assetRequest' => $assetRequest,
        ]);
    }

    /**
     * Batalkan pengajuan sendiri (hanya saat status Pending).
     */
    public function cancel(Request $request, AssetRequest $assetRequest)
    {
        if ($assetRequest->status !== 'Pending') {
            return redirect()->back()->with('error', 'Pengajuan yang sudah diproses tidak dapat dibatalkan.');
        }

        DB::transaction(function () use ($assetRequest) {
            $assetRequest->update(['status' => 'Dibatalkan']);

            AssetRequestApproval::where('asset_request_id', $assetRequest->id)
                ->where('status', 'Pending')
                ->update(['status' => 'Auto Reject', 'notes' => 'Dibatalkan oleh pemohon.']);
        });

        return redirect()->route('asset-requests.index')->with('success', 'Pengajuan berhasil dibatalkan.');
    }

    /**
     * Buat baris approval bertingkat untuk sebuah pengajuan.
     *
     * Sumber approver: ApprovalWorkflow dengan workflow_type "Pengajuan Barang"
     * yang role-nya cocok dengan pemohon. Bila tidak ada workflow yang cocok,
     * dipakai atasan langsung (employee_information.direct_supervisor); bila
     * itu pun kosong, pengajuan dialihkan ke role "Admin GA" agar tidak buntu.
     */
    private function createApprovals(AssetRequest $assetRequest, User $user): void
    {
        $workflows = ApprovalWorkflow::where('workflow_type', 'Pengajuan Barang')->get();
        $userRoleIds = $user->roles()->pluck('roles.id')->map(fn ($id) => (string) $id)->all();

        $matched = null;
        foreach ($workflows as $wf) {
            $roleIds = is_array($wf->role_id) ? $wf->role_id : (json_decode($wf->role_id, true) ?? []);
            $roleIds = array_map('strval', $roleIds);
            if (array_intersect($userRoleIds, $roleIds)) {
                $matched = $wf;
                break;
            }
        }

        $created = 0;

        if ($matched) {
            $steps = ApprovalWorkflowStep::where('approval_workflow_id', $matched->id)
                ->orderBy('approval_level')
                ->get();

            foreach ($steps as $step) {
                $approverNik = null;
                $approverRole = null;

                if ($step->approver_type === 'specific_user') {
                    $approverNik = $step->approver_nik;
                    $approverRole = $step->employee_role;
                } elseif ($step->approver_type === 'division_head') {
                    $devision = $user->role ? $user->role->devision : null;
                    if ($devision && $devision->head) {
                        $approverNik = $devision->head;
                        $headUser = User::with('role')->where('nik', $approverNik)->first();
                        $approverRole = $headUser && $headUser->role ? $headUser->role->name : 'Head of Division';
                    }
                } elseif ($step->approver_type === 'creator') {
                    $approverNik = $user->nik;
                    $approverRole = 'Pemohon';
                }

                // Langkah yang hanya menentukan role (tanpa NIK) -> resolve ke user pertama ber-role itu.
                if (! $approverNik && $step->employee_role) {
                    $roleUser = User::whereHas('roles', fn ($q) => $q->where('name', $step->employee_role))->first();
                    if ($roleUser) {
                        $approverNik = $roleUser->nik;
                        $approverRole = $step->employee_role;
                    }
                }

                if ($approverNik) {
                    $assetRequest->approvals()->create([
                        'approver_level' => $step->approval_level,
                        'approver_nik' => $approverNik,
                        'approver_role' => $approverRole,
                        'status' => 'Pending',
                    ]);
                    $created++;
                }
            }
        }

        if ($created === 0) {
            $approverNik = EmployeeInformation::where('nik', $user->nik)->value('direct_supervisor');
            $approverRole = 'Atasan Langsung';

            if (! $approverNik) {
                $gaAdmin = User::whereHas('roles', fn ($q) => $q->where('name', 'Admin GA'))->first();
                $approverNik = $gaAdmin?->nik;
                $approverRole = 'Admin GA';
            }

            if ($approverNik) {
                $assetRequest->approvals()->create([
                    'approver_level' => 1,
                    'approver_nik' => $approverNik,
                    'approver_role' => $approverRole,
                    'status' => 'Pending',
                ]);
            }
        }
    }

    /**
     * Nomor pengajuan otomatis: REQ-0001, REQ-0002, dst.
     */
    private function generateRequestNumber(): string
    {
        $last = AssetRequest::orderByDesc('id')->first();
        $next = $last ? $last->id + 1 : 1;

        do {
            $number = 'REQ-'.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
            $next++;
        } while (AssetRequest::where('request_number', $number)->exists());

        return $number;
    }
}
