<?php

namespace App\Http\Controllers;

use App\Models\EmployeePosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeePositionController extends Controller
{
    public function index()
    {
        $employeePositions = EmployeePosition::orderBy('order')->get();
        return Inertia::render('Dashboard/Master/EmployeePosition/Index', [
            'employeePositions' => $employeePositions
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Master/EmployeePosition/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:employee_positions,name',
            'order' => 'nullable|integer|min:1',
        ], [
            'name.required' => 'Nama jabatan wajib diisi.',
            'name.string' => 'Nama jabatan harus berupa teks.',
            'name.max' => 'Nama jabatan maksimal 255 karakter.',
            'name.unique' => 'Nama jabatan ini sudah terdaftar.',
            'order.integer' => 'Urutan harus berupa angka.',
            'order.min' => 'Urutan minimal 1.',
        ]);

        $order = $request->order;
        if (!$order) {
            $maxOrder = EmployeePosition::max('order');
            $order = $maxOrder ? $maxOrder + 1 : 1;
        }

        EmployeePosition::create([
            'name' => $request->name,
            'order' => $order,
        ]);

        return redirect()->route('employee-positions.index')->with('success', 'Jabatan karyawan berhasil ditambahkan.');
    }

    public function edit(EmployeePosition $employeePosition)
    {
        return Inertia::render('Dashboard/Master/EmployeePosition/Edit', [
            'employeePosition' => $employeePosition,
        ]);
    }

    public function update(Request $request, EmployeePosition $employeePosition)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:employee_positions,name,' . $employeePosition->id,
            'order' => 'required|integer|min:1',
        ], [
            'name.required' => 'Nama jabatan wajib diisi.',
            'name.string' => 'Nama jabatan harus berupa teks.',
            'name.max' => 'Nama jabatan maksimal 255 karakter.',
            'name.unique' => 'Nama jabatan ini sudah terdaftar.',
            'order.required' => 'Urutan wajib diisi.',
            'order.integer' => 'Urutan harus berupa angka.',
            'order.min' => 'Urutan minimal 1.',
        ]);

        $employeePosition->update([
            'name' => $request->name,
            'order' => $request->order,
        ]);

        return redirect()->route('employee-positions.index')->with('success', 'Jabatan karyawan berhasil diperbarui.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:employee_positions,id',
        ], [
            'ids.required' => 'Data ID wajib diisi.',
            'ids.array' => 'Data ID harus berupa array.',
            'ids.*.exists' => 'Data ID tidak valid.',
        ]);

        foreach ($request->ids as $index => $id) {
            EmployeePosition::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->back()->with('success', 'Urutan jabatan berhasil diperbarui.');
    }

    public function destroy(EmployeePosition $employeePosition)
    {
        $employeePosition->delete();
        return redirect()->route('employee-positions.index')->with('success', 'Jabatan karyawan berhasil dihapus.');
    }
}
