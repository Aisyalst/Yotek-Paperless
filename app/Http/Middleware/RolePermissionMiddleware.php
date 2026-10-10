<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
        $user = auth()->user();
        $currentRouteName = $request->route()->getName(); // Ambil nama route saat ini

        // Cek akses via SEMUA role user (union) — aman untuk multi-role.
        if (!$user->hasPermissionTo($currentRouteName)) {
            $roleName = $user->role?->name ?? 'Unknown Role';
            return back()->with('error', 'As '. $roleName .' You are not authorized to access ' . $currentRouteName . ' !!');
        }

        return $next($request);
    }
}
