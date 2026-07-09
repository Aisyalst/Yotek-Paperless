<?php

namespace App\Http\Controllers;

use App\Models\RolePermission;
use App\Models\Route;
use Illuminate\Http\Request;

class RouteController extends Controller
{
    public function index()
    {
        $routes = Route::with('permissions')->orderBy('name')->get();
        return inertia('Dashboard/Setting/Routes/Index', 
            ['routes' => $routes]
        );
    }

    public function create()
    {
        return inertia('Dashboard/Setting/Routes/Create');
    }

    public function store(Request $request)
    {
        if ($request->has('routes') && is_array($request->routes)) {
            // Bulk create
            $request->validate([
                'routes' => 'required|array|min:1',
                'routes.*.name' => 'required|string|max:255|unique:routes,name',
                'routes.*.route_name' => 'required|string|max:255|unique:routes,route_name',
            ], [
                'routes.*.name.unique' => 'The route name must be unique.',
                'routes.*.route_name.unique' => 'The system route name must be unique.',
            ]);

            foreach ($request->routes as $routeData) {
                Route::create([
                    'name' => $routeData['name'],
                    'route_name' => $routeData['route_name'],
                ]);
            }
        } else {
            // Single create
            $request->validate([
                'name' => 'required|string|max:255|unique:routes,name',
                'route_name' => 'required|string|max:255|unique:routes,route_name',
            ]);

            Route::create([
                'name' => $request->name,
                'route_name' => $request->route_name,
            ]);
        }

        return redirect()->route('routes.index')->with('success', $request->has('routes') ? 'Routes created successfully.' : 'Route created successfully.');
    }

    public function edit(Route $route)
    {
        return inertia('Dashboard/Setting/Routes/Edit', 
            ['route' => $route]
        );
    }

    public function update(Request $request, Route $route)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:routes,name,' . $route->id,
            'route_name' => 'required|string|max:255|unique:routes,route_name,' . $route->id,
        ]);

        $route->update([
            'name' => $request->name,
            'route_name' => $request->route_name,
        ]);

        return redirect()->route('routes.index')->with('success', 'Route updated successfully.');
    }

    public function destroy(Route $route)
    {
        $route->delete();
        return redirect()->route('routes.index')->with('success', 'Route deleted successfully.');
    }
}
