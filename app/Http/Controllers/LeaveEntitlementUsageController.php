<?php

namespace App\Http\Controllers;

use App\Models\LeaveEntitlementUsage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class LeaveEntitlementUsageController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $usages = LeaveEntitlementUsage::with(['leaveEntitlement', 'leaveRequest'])
            ->whereHas('leaveEntitlement', function ($query) use ($user) {
                $query->where('nik', $user->nik);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Profile/LeaveHistory', [
            'usages' => $usages
        ]);
    }
}
