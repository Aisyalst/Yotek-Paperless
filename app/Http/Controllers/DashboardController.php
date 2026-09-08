<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Carbon\Carbon;
use Inertia\Inertia;

use App\Models\Company;
use App\Models\Banner;
use App\Models\CompanyAlbum;
use App\Models\QuickAccess;

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

        $companies = Company::all();
        $banners = Banner::orderBy('sort_order')->get();
        $albums = CompanyAlbum::latest()->get();
        $quickAccesses = QuickAccess::orderBy('sort_order')->get();

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'companies' => $companies,
            'banners' => $banners,
            'albums' => $albums,
            'quickAccesses' => $quickAccesses,
        ]);
    }
}
