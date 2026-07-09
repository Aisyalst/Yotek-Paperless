<?php

namespace App\Http\Controllers;

use App\Models\DashboardMenu;
use App\Models\Route;
use Illuminate\Http\Request;

class DashboardMenuController extends Controller
{
    public function index()
    {
        $dashboardMenus = DashboardMenu::with(['route', 'parent', 'children' => function($q) {
            $q->orderBy('position');
        }])
        ->whereNull('parent_id')
        ->orderBy('position')
        ->get();

        return inertia('Dashboard/Setting/DashMenu/Index', 
            ['dashboardMenus' => $dashboardMenus]
        );
    }

    public function create()
    {
        $routes = Route::orderBy('name')->get();
        $parentMenus = DashboardMenu::where('type', 'Dropdown')->whereNull('parent_id')->orderBy('name')->get();
        return inertia('Dashboard/Setting/DashMenu/Create', [
            'routes' => $routes,
            'parentMenus' => $parentMenus,
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'name' => 'required|string|max:255|unique:dashboard_menus,name',
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:Single,Dropdown',
            'section' => 'required|in:Tables,Settings',
            'parent_id' => 'nullable|exists:dashboard_menus,id',
            'route_id' => 'nullable|required_if:type,Single|exists:routes,id',
            'position' => 'required|integer|min:1',
        ]);

        $parentId = $request->type === 'Single' ? $request->parent_id : null;

        // Shift positions to handle collisions
        $this->shiftPositions($request->position, $parentId);

        // 2. Simpan ke database
        DashboardMenu::create([
            'name' => $request->name,
            'icon' => $request->icon,
            'type' => $request->type,
            'section' => $request->section,
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
        return inertia('Dashboard/Setting/DashMenu/Edit', [
            'dashboardMenu' => $dashboardMenu,
            'routes' => $routes,
            'parentMenus' => $parentMenus,
        ]);
    }

    public function update(Request $request, DashboardMenu $dashboardMenu)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:dashboard_menus,name,' . $dashboardMenu->id,
            'icon' => 'nullable|string|max:255',
            'type' => 'required|in:Single,Dropdown',
            'section' => 'required|in:Tables,Settings',
            'parent_id' => 'nullable|exists:dashboard_menus,id',
            'route_id' => 'nullable|required_if:type,Single|exists:routes,id',
            'position' => 'required|integer|min:1',
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
            'section' => $request->section,
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
