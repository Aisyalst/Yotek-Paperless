<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = Company::latest();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $companies = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard/Company/Index', [
            'companies' => $companies,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Company/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'branches' => 'required|array|min:1',
            'branches.*.region' => 'required|string|max:255',
            'branches.*.province' => 'required|string|max:255',
            'branches.*.city' => 'required|string|max:255',
        ]);

        Company::create([
            'name' => $request->name,
            'branch' => $request->branches,
        ]);

        return redirect()->route('companies.index')->with('success', 'Perusahaan berhasil ditambahkan.');
    }

    public function edit(Company $company)
    {
        return Inertia::render('Dashboard/Company/Edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'branches' => 'required|array|min:1',
            'branches.*.region' => 'required|string|max:255',
            'branches.*.province' => 'required|string|max:255',
            'branches.*.city' => 'required|string|max:255',
        ]);

        $company->update([
            'name' => $request->name,
            'branch' => $request->branches,
        ]);

        return redirect()->route('companies.index')->with('success', 'Data perusahaan berhasil diperbarui.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Data perusahaan berhasil dihapus.');
    }
}
