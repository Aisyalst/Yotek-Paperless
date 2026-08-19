<?php

namespace App\Http\Controllers;

use App\Models\DashboardMenu;
use App\Models\DashboardMenuSection;
use App\Models\Route;
use Illuminate\Http\Request;

class DashboardMenuController extends Controller
{
    public function index()
    {
        $dashboardMenus = DashboardMenu::with(['route', 'parent', 'section', 'children' => function($q) {
            $q->orderBy('position');
        }])
        ->whereNull('parent_id')
        ->orderBy('position')
        ->get();

        $sections = DashboardMenuSection::orderBy('order')->get();

        return inertia('Dashboard/Setting/DashMenu/Index', 
            [
                'dashboardMenus' => $dashboardMenus,
                'sections' => $sections
            ]
        );
    }

    public function create()
    {
        $routes = Route::orderBy('name')->get();
        $parentMenus = DashboardMenu::where('type', 'Dropdown')->whereNull('parent_id')->orderBy('name')->get();
        $sections = DashboardMenuSection::orderBy('order')->get();
        return inertia('Dashboard/Setting/DashMenu/Create', [
            'routes' => $routes,
            'parentMenus' => $parentMenus,
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'name' => 'required|string|max:255|unique:dashboard_menus,name',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:Single,Dropdown',
            'section_id' => 'required|exists:dashboard_menu_sections,id',
            'parent_id' => 'nullable|exists:dashboard_menus,id',
            'route_id' => 'nullable|required_if:type,Single|exists:routes,id',
            'position' => 'required|integer|min:1',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa string.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'name.unique' => 'Nama sudah digunakan.',
            'icon.string' => 'Ikon harus berupa string.',
            'icon.max' => 'Ikon maksimal 255 karakter.',
            'type.required' => 'Tipe wajib diisi.',
            'type.in' => 'Tipe tidak valid.',
            'section_id.required' => 'Bagian wajib diisi.',
            'section_id.exists' => 'Bagian tidak valid.',
            'parent_id.exists' => 'Induk tidak valid.',
            'route_id.required_if' => 'Rute wajib diisi jika tipe adalah Single.',
            'route_id.exists' => 'Rute tidak valid.',
            'position.required' => 'Posisi wajib diisi.',
            'position.integer' => 'Posisi harus berupa angka.',
            'position.min' => 'Posisi minimal 1.',
        ]);

        $parentId = $request->type === 'Single' ? $request->parent_id : null;

        // Shift positions to handle collisions
        $this->shiftPositions($request->position, $parentId);

        // 2. Simpan ke database
        DashboardMenu::create([
            'name' => $request->name,
            'icon' => $request->icon,
            'type' => $request->type,
            'section_id' => $request->section_id,
            'parent_id' => $parentId,
            'route_id' => $request->type === 'Single' ? $request->route_id : null,
            'position' => $request->position,
        ]);

        return redirect()->route('dashboard-menus.index')->with('success', 'Dashboard menu created successfully.');
    }

    public function edit(DashboardMenu $dashboardMenu)
    {
        $routes = Route::orderBy('name')->get();
        $parentMenus = DashboardMenu::where('type', 'Dropdown')
            ->whereNull('parent_id')
            ->where('id', '!=', $dashboardMenu->id)
            ->orderBy('name')
            ->get();
        $sections = DashboardMenuSection::orderBy('order')->get();
        return inertia('Dashboard/Setting/DashMenu/Edit', [
            'dashboardMenu' => $dashboardMenu,
            'routes' => $routes,
            'parentMenus' => $parentMenus,
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, DashboardMenu $dashboardMenu)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:dashboard_menus,name,' . $dashboardMenu->id,
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:Single,Dropdown',
            'section_id' => 'required|exists:dashboard_menu_sections,id',
            'parent_id' => 'nullable|exists:dashboard_menus,id',
            'route_id' => 'nullable|required_if:type,Single|exists:routes,id',
            'position' => 'required|integer|min:1',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa string.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'name.unique' => 'Nama sudah digunakan.',
            'icon.string' => 'Ikon harus berupa string.',
            'icon.max' => 'Ikon maksimal 255 karakter.',
            'type.required' => 'Tipe wajib diisi.',
            'type.in' => 'Tipe tidak valid.',
            'section_id.required' => 'Bagian wajib diisi.',
            'section_id.exists' => 'Bagian tidak valid.',
            'parent_id.exists' => 'Induk tidak valid.',
            'route_id.required_if' => 'Rute wajib diisi jika tipe adalah Single.',
            'route_id.exists' => 'Rute tidak valid.',
            'position.required' => 'Posisi wajib diisi.',
            'position.integer' => 'Posisi harus berupa angka.',
            'position.min' => 'Posisi minimal 1.',
        ]);

        $parentId = $request->type === 'Single' ? $request->parent_id : null;

        // Only shift if position or parent_id has changed
        if ($dashboardMenu->position != $request->position || $dashboardMenu->parent_id != $parentId) {
            $this->shiftPositions($request->position, $parentId, $dashboardMenu->id);
        }

        $dashboardMenu->update([
            'name' => $request->name,
            'icon' => $request->icon,
            'type' => $request->type,
            'section_id' => $request->section_id,
            'parent_id' => $parentId,
            'route_id' => $request->type === 'Single' ? $request->route_id : null,
            'position' => $request->position,
        ]);

        return redirect()->route('dashboard-menus.index')->with('success', 'Dashboard menu updated successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:dashboard_menus,id',
        ], [
            'ids.required' => 'Data ID wajib diisi.',
            'ids.array' => 'Data ID harus berupa array.',
            'ids.*.exists' => 'Data ID tidak valid.',
        ]);

        foreach ($request->ids as $index => $id) {
            DashboardMenu::where('id', $id)->update(['position' => $index + 1]);
        }

        return redirect()->route('dashboard-menus.index')->with('success', 'Menu order updated successfully.');
    }

    public function destroy(DashboardMenu $dashboardMenu)
    {
        $dashboardMenu->delete();
        return redirect()->route('dashboard-menus.index')->with('success', 'Dashboard menu deleted successfully.');
    }

    private function shiftPositions($newPosition, $parentId, $excludeId = null)
    {
        $query = DashboardMenu::where('position', '>=', $newPosition);
        if ($parentId) {
            $query->where('parent_id', $parentId);
        } else {
            $query->whereNull('parent_id');
        }
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $menus = $query->orderBy('position', 'desc')->get();
        foreach ($menus as $m) {
            $m->increment('position');
        }
    }
}
