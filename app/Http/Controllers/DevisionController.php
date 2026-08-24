<?php

namespace App\Http\Controllers;

use App\Models\Devision;
use App\Models\EmployeeInformation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevisionController extends Controller
{
    public function index()
    {
        $devisions = Devision::with('headEmployee.user')->orderBy('name')->get();
        return Inertia::render('Dashboard/Master/Devision/Index', [
            'devisions' => $devisions
        ]);
    }

    public function create()
    {
        $employees = EmployeeInformation::with('user')->get();
        return Inertia::render('Dashboard/Master/Devision/Create', [
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'head' => 'nullable|string|exists:employee_information,nik',
        ], [
            'name.required' => 'Nama divisi wajib diisi.',
            'name.string' => 'Nama divisi harus berupa string.',
            'name.max' => 'Nama divisi maksimal 255 karakter.',
            'head.exists' => 'Karyawan tidak valid.',
        ]);

        Devision::create([
            'name' => $request->name,
            'head' => $request->head,
        ]);

        return redirect()->route('devisions.index')->with('success', 'Divisi berhasil ditambahkan.');
    }

    public function edit(Devision $devision)
    {
        $employees = EmployeeInformation::with('user')->get();
        return Inertia::render('Dashboard/Master/Devision/Edit', [
            'devision' => $devision,
            'employees' => $employees
        ]);
    }

    public function update(Request $request, Devision $devision)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'head' => 'nullable|string|exists:employee_information,nik',
        ], [
            'name.required' => 'Nama divisi wajib diisi.',
            'name.string' => 'Nama divisi harus berupa string.',
            'name.max' => 'Nama divisi maksimal 255 karakter.',
            'head.exists' => 'Karyawan tidak valid.',
        ]);

        $devision->update([
            'name' => $request->name,
            'head' => $request->head,
        ]);

        return redirect()->route('devisions.index')->with('success', 'Divisi berhasil diperbarui.');
    }

    public function destroy(Devision $devision)
    {
        $devision->delete();
        return redirect()->route('devisions.index')->with('success', 'Divisi berhasil dihapus.');
    }
}
