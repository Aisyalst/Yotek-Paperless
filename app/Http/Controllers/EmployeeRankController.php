<?php

namespace App\Http\Controllers;

use App\Models\EmployeeRank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeRankController extends Controller
{
    public function index()
    {
        $employeeRanks = EmployeeRank::orderBy('order')->get();
        return Inertia::render('Dashboard/Master/EmployeeRank/Index', [
            'employeeRanks' => $employeeRanks
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Master/EmployeeRank/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:employee_ranks,title',
            'order' => 'nullable|integer|min:1',
        ], [
            'title.required' => 'Jabatan/Pangkat wajib diisi.',
            'title.string' => 'Jabatan/Pangkat harus berupa teks.',
            'title.max' => 'Jabatan/Pangkat maksimal 255 karakter.',
            'title.unique' => 'Jabatan/Pangkat ini sudah terdaftar.',
            'order.integer' => 'Urutan harus berupa angka.',
            'order.min' => 'Urutan minimal 1.',
        ]);

        $order = $request->order;
        if (!$order) {
            $maxOrder = EmployeeRank::max('order');
            $order = $maxOrder ? $maxOrder + 1 : 1;
        }

        EmployeeRank::create([
            'title' => $request->title,
            'order' => $order,
        ]);

        return redirect()->route('employee-ranks.index')->with('success', 'Employee rank created successfully.');
    }

    public function edit(EmployeeRank $employeeRank)
    {
        return Inertia::render('Dashboard/Master/EmployeeRank/Edit', [
            'employeeRank' => $employeeRank,
        ]);
    }

    public function update(Request $request, EmployeeRank $employeeRank)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:employee_ranks,title,' . $employeeRank->id,
            'order' => 'required|integer|min:1',
        ], [
            'title.required' => 'Jabatan/Pangkat wajib diisi.',
            'title.string' => 'Jabatan/Pangkat harus berupa teks.',
            'title.max' => 'Jabatan/Pangkat maksimal 255 karakter.',
            'title.unique' => 'Jabatan/Pangkat ini sudah terdaftar.',
            'order.required' => 'Urutan wajib diisi.',
            'order.integer' => 'Urutan harus berupa angka.',
            'order.min' => 'Urutan minimal 1.',
        ]);

        $employeeRank->update([
            'title' => $request->title,
            'order' => $request->order,
        ]);

        return redirect()->route('employee-ranks.index')->with('success', 'Employee rank updated successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:employee_ranks,id',
        ], [
            'ids.required' => 'Data ID wajib diisi.',
            'ids.array' => 'Data ID harus berupa array.',
            'ids.*.exists' => 'Data ID tidak valid.',
        ]);

        foreach ($request->ids as $index => $id) {
            EmployeeRank::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->back()->with('success', 'Rank order updated successfully.');
    }

    public function destroy(EmployeeRank $employeeRank)
    {
        $employeeRank->delete();
        return redirect()->route('employee-ranks.index')->with('success', 'Employee rank deleted successfully.');
    }
}
