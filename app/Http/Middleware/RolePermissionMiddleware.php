<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\RolePermission;

class RolePermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }
        $userRole = auth()->user()->role_id;
        $currentRouteName = $request->route()->getName(); // Ambil nama route saat ini

        // Cek di database, apakah role ini punya akses ke route ini?
        $punyaAkses = RolePermission::where('role_id', $userRole)
                                    ->whereHas('route', function ($query) use ($currentRouteName) {
                                        $query->where('route_name', $currentRouteName);
                                    })
                                    ->exists();

        if (!$punyaAkses) {
            return back()->with('error', 'As '. auth()->user()->role->name .' You are not authorized to access ' . $currentRouteName . ' !!');
            // abort(403, 'Anda Sebagai '. auth()->user()->role->name .' Tidak Memiliki Hak Untuk Mengakses Halaman Route Dengan Nama ini ' . $currentRouteName . ' !!');
        }

        return $next($request);
    }
}
