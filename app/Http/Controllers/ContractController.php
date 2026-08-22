<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContractInformation;
use App\Models\User;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = ContractInformation::with('user')->latest();

        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $contracts = $query->paginate($perPage)->withQueryString();

        return inertia('Dashboard/Contract/Index', [
            'contracts' => $contracts,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ]
        ]);
    }

    public function create()
    {
        $users = User::all(['nik', 'name']);
        
        return inertia('Dashboard/Contract/Create', [
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nik' => 'required|exists:users,nik',
            'contract_type' => 'nullable|string|max:255',
            'contract_number' => 'nullable|string|max:255',
            'contract_start_date' => 'nullable|date',
            'contract_end_date' => 'nullable|date|after_or_equal:contract_start_date',
            'contract_duration' => 'nullable|string|max:255',
            'contract_sequence' => 'nullable|integer',
            'contract_status' => 'nullable|string|max:255',
            'previous_contract' => 'nullable|string|max:255',
            'next_action' => 'nullable|string|max:255',
        ], [
            'nik.required' => 'Karyawan wajib dipilih.',
            'nik.exists' => 'Karyawan tidak valid.',
            'contract_end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
        ]);

        ContractInformation::create($request->all());

        return redirect()->route('contracts.index')->with('success', 'Kontrak berhasil ditambahkan.');
    }

    public function edit(ContractInformation $contract)
    {
        $contract->load('user');
        $users = User::all(['nik', 'name']);

        return inertia('Dashboard/Contract/Edit', [
            'contract' => $contract,
            'users' => $users
        ]);
    }

    public function update(Request $request, ContractInformation $contract)
    {
        $request->validate([
            'nik' => 'required|exists:users,nik',
            'contract_type' => 'nullable|string|max:255',
            'contract_number' => 'nullable|string|max:255',
            'contract_start_date' => 'nullable|date',
            'contract_end_date' => 'nullable|date|after_or_equal:contract_start_date',
            'contract_duration' => 'nullable|string|max:255',
            'contract_sequence' => 'nullable|integer',
            'contract_status' => 'nullable|string|max:255',
            'previous_contract' => 'nullable|string|max:255',
            'next_action' => 'nullable|string|max:255',
        ], [
            'nik.required' => 'Karyawan wajib dipilih.',
            'nik.exists' => 'Karyawan tidak valid.',
            'contract_end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
        ]);

        $contract->update($request->all());

        return redirect()->route('contracts.index')->with('success', 'Data kontrak berhasil diperbarui.');
    }

    public function destroy(ContractInformation $contract)
    {
        $contract->delete();
        return redirect()->back()->with('success', 'Data kontrak berhasil dihapus.');
    }
}
