<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_send_notification_to_specific_user()
    {
        $role = \App\Models\Role::create(['name' => 'Test Role', 'guard_name' => 'web']);
        $user1 = User::factory()->create(['role_id' => $role->id]);
        $user2 = User::factory()->create(['role_id' => $role->id]);

        $service = new NotificationService();
        $service->send([
            'title' => 'Hello User 1',
            'body' => 'Test',
            'target_type' => 'user',
            'target_value' => (string) $user1->id,
        ]);

        $this->assertEquals(1, $user1->unreadNotifications()->count());
        $this->assertEquals(0, $user2->unreadNotifications()->count());
    }

    public function test_send_notification_to_all_users()
    {
        $role = \App\Models\Role::create(['name' => 'Test Role', 'guard_name' => 'web']);
        User::factory()->count(3)->create(['role_id' => $role->id]);

        $service = new NotificationService();
        $service->send([
            'title' => 'Hello All',
            'body' => 'Test',
            'target_type' => 'all',
            'target_value' => null,
        ]);

        $this->assertEquals(1, User::first()->unreadNotifications()->count());
        $this->assertEquals(User::count(), \App\Models\NotificationRecipient::count());
    }

    public function test_mark_as_read()
    {
        $role = \App\Models\Role::create(['name' => 'Test Role', 'guard_name' => 'web']);
        $user = User::factory()->create(['role_id' => $role->id]);
        $service = new NotificationService();
        $service->send([
            'title' => 'Hello',
            'body' => 'Test',
            'target_type' => 'user',
            'target_value' => (string) $user->id,
        ]);

        $recipient = $user->notifications()->first();

        $response = $this->actingAs($user)
            ->withoutMiddleware([\App\Http\Middleware\RolePermissionMiddleware::class])
            ->patch(route('notifications.read', $recipient->id));
        $response->assertStatus(302);

        $this->assertTrue($recipient->fresh()->is_read);
        $this->assertEquals(0, $user->unreadNotifications()->count());
    }

    public function test_mark_all_as_read()
    {
        $role = \App\Models\Role::create(['name' => 'Test Role', 'guard_name' => 'web']);
        $user = User::factory()->create(['role_id' => $role->id]);
        $service = new NotificationService();
        $service->send([
            'title' => 'Hello',
            'body' => 'Test',
            'target_type' => 'user',
            'target_value' => (string) $user->id,
        ]);
        $service->send([
            'title' => 'Hello 2',
            'body' => 'Test 2',
            'target_type' => 'user',
            'target_value' => (string) $user->id,
        ]);

        $this->assertEquals(2, $user->unreadNotifications()->count());

        $response = $this->actingAs($user)
            ->withoutMiddleware([\App\Http\Middleware\RolePermissionMiddleware::class])
            ->patch(route('notifications.read-all'));
        $response->assertStatus(302);

        $this->assertEquals(0, $user->unreadNotifications()->count());
    }
}
