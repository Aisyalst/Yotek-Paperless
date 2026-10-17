<?php

namespace Tests\Feature;

use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MyMeetingParticipantsTest extends TestCase
{
    use RefreshDatabase;

    public function test_my_meetings_page_loads_all_participants(): void
    {
        $this->seed(\Database\Seeders\RouteSettingSeeder::class);

        // Role Web Dev = akses penuh (dibuat SEBELUM RoleAccessSeeder agar dapat permission).
        $role = \App\Models\Role::create(['name' => 'Web Dev', 'devision_id' => null]);

        $this->seed(\Database\Seeders\RoleAccessSeeder::class);

        // Buat user + meeting + 3 peserta.
        $me = User::create([
            'name' => 'Tester', 'nik' => '999000111', 'email' => 'tester@example.com',
            'password' => bcrypt('secret'), 'is_active' => true, 'role_id' => $role->id,
        ]);
        $me->roles()->attach($role->id, ['is_primary' => true]);
        $other1 = User::create(['name' => 'Peserta Satu', 'nik' => '999000222', 'email' => 'p1@example.com', 'password' => bcrypt('x'), 'is_active' => true]);
        $other2 = User::create(['name' => 'Peserta Dua', 'nik' => '999000333', 'email' => 'p2@example.com', 'password' => bcrypt('x'), 'is_active' => true]);

        $meeting = Meeting::create([
            'title' => 'Rapat Uji', 'type' => 'online', 'date' => now()->toDateString(),
            'start_time' => '08:00', 'end_time' => '09:00', 'organizer_nik' => $me->nik, 'status' => 'Terjadwal',
        ]);

        foreach ([$me, $other1, $other2] as $i => $u) {
            MeetingParticipant::create([
                'meeting_id' => $meeting->id, 'employee_nik' => $u->nik,
                'status' => $i === 0 ? 'accepted' : 'pending',
            ]);
        }

        $this->actingAs($me)
            ->get(route('my-meetings.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/MyMeeting/Index')
                ->has('meetings', 1)
                ->has('meetings.0.participants', 3)
                ->has('meetings.0.participants.0.employee')
                ->where('meetings.0.participants.0.employee.name', 'Tester')
            );
    }
}
