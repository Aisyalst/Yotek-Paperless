<?php

namespace App\Http\Controllers;

use App\Models\NotificationRecipient;
use App\Models\Role;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()
            ->with('notification')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function create()
    {
        $users = User::select('id', 'name')->get();
        $roles = Role::select('name')->get(); // role target_value uses name

        return Inertia::render('Notifications/Create', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request, NotificationService $service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'nullable|string|in:info,warning,success,error',
            'url' => 'nullable|string|max:255',
            'target_type' => 'required|string|in:user,role,all',
            'target_value' => 'nullable|string|required_if:target_type,user,role',
        ]);

        $validated['created_by'] = $request->user()->id;

        $service->send($validated);

        return back()->with('success', 'Notifikasi berhasil dikirim.');
    }

    public function markAsRead(Request $request, NotificationRecipient $recipient)
    {
        if ($recipient->user_id !== $request->user()->id) {
            abort(403);
        }

        $recipient->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return back();
    }
}
