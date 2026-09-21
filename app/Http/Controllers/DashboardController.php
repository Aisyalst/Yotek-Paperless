<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Carbon\Carbon;
use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;
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
        $albums = CompanyAlbum::latest()->take(15)->get();
        $quickAccesses = QuickAccess::orderBy('sort_order')->get();
        $nik = Auth::user()->nik;

        $meetingInvitations = \App\Models\Meeting::with(['room', 'organizer', 'participants' => function($q) use ($nik) {
            $q->where('employee_nik', $nik);
        }])
        ->whereHas('participants', function($q) use ($nik) {
            $q->where('employee_nik', $nik)->where('status', 'pending');
        })
        ->whereDate('date', '>=', Carbon::today())
        ->orderBy('date', 'asc')
        ->orderBy('start_time', 'asc')
        ->get();

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'companies' => $companies,
            'banners' => $banners,
            'albums' => $albums,
            'quickAccesses' => $quickAccesses,
            'meetingInvitations' => $meetingInvitations,
        ]);
    }
}
