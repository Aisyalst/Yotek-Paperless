<?php

namespace App\Http\Controllers;

use App\Models\DashboardMenuSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardMenuSectionController extends Controller
{
    public function index()
    {
        $sections = DashboardMenuSection::orderBy('order')->get();
        return Inertia::render('Dashboard/Setting/DashMenuSection/Index', [
            'sections' => $sections
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Setting/DashMenuSection/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:dashboard_menu_sections,name',
            'order' => 'required|integer|min:1',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa string.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'name.unique' => 'Nama sudah digunakan.',
            'order.required' => 'Urutan wajib diisi.',
            'order.integer' => 'Urutan harus berupa angka.',
            'order.min' => 'Urutan minimal 1.',
        ]);

        DashboardMenuSection::create([
            'name' => $request->name,
            'order' => $request->order,
        ]);

        return redirect()->route('dashboard-menu-sections.index')->with('success', 'Dashboard menu section created successfully.');
    }

    public function edit(DashboardMenuSection $dashboardMenuSection)
    {
        return Inertia::render('Dashboard/Setting/DashMenuSection/Edit', [
            'dashboardMenuSection' => $dashboardMenuSection,
        ]);
    }

    public function update(Request $request, DashboardMenuSection $dashboardMenuSection)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:dashboard_menu_sections,name,' . $dashboardMenuSection->id,
            'order' => 'required|integer|min:1',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa string.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'name.unique' => 'Nama sudah digunakan.',
            'order.required' => 'Urutan wajib diisi.',
            'order.integer' => 'Urutan harus berupa angka.',
            'order.min' => 'Urutan minimal 1.',
        ]);

        $dashboardMenuSection->update([
            'name' => $request->name,
            'order' => $request->order,
        ]);

        return redirect()->route('dashboard-menu-sections.index')->with('success', 'Dashboard menu section updated successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:dashboard_menu_sections,id',
        ], [
            'ids.required' => 'Data ID wajib diisi.',
            'ids.array' => 'Data ID harus berupa array.',
            'ids.*.exists' => 'Data ID tidak valid.',
        ]);

        foreach ($request->ids as $index => $id) {
            DashboardMenuSection::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->route('dashboard-menu-sections.index')->with('success', 'Section order updated successfully.');
    }

    public function destroy(DashboardMenuSection $dashboardMenuSection)
    {
        if ($dashboardMenuSection->menus()->count() > 0) {
            return redirect()->back()->with('error', 'Gagal menghapus! Masih ada menu dashboard yang terhubung ke bagian ini.');
        }

        $dashboardMenuSection->delete();
        return redirect()->route('dashboard-menu-sections.index')->with('success', 'Dashboard menu section deleted successfully.');
    }
}
