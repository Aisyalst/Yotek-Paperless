<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total' => User::count(),
            'today' => User::whereDate('created_at', Carbon::today())->count(),
            'this_week' => User::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count(),
            'this_month' => User::whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year)->count(),
            'active' => User::where('is_active', 1)->count(),
            'inactive' => User::where('is_active', 0)->count(),
            'by_role' => Role::withCount('users')->get()->map(function($role) {
                return [
                    'name' => $role->name,
                    'count' => $role->users_count
                ];
            })
        ];

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats
        ]);
    }
}
