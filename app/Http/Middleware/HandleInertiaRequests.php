<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() && $request->user()->role
                    ? $request->user()->role->permissions->load('route')->pluck('route.route_name')->filter()->toArray()
                    : [],
                'unreadNotificationsCount' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
                'latestNotifications' => $request->user() ? $request->user()->notifications()->with('notification')->orderBy('created_at', 'desc')->take(5)->get() : [],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarMenus' => \App\Models\DashboardMenu::with([
                'route',
                'section',
                'children' => function ($query) {
                    $query->orderBy('position');
                },
                'children.route'
            ])
            ->whereNull('parent_id')
            ->orderBy('position')
            ->get(),
        ];
    }
}
