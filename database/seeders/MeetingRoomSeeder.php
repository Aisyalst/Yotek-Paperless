<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MeetingRoom;

class MeetingRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Ruang Meeting Lantai 1',
                'location' => 'Lantai 1',
                'capacity' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Ruang Meeting Lantai 2',
                'location' => 'Lantai 2',
                'capacity' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Ruang Meeting Lantai 3',
                'location' => 'Lantai 3',
                'capacity' => 15,
                'is_active' => true,
            ]
        ];

        foreach ($rooms as $room) {
            MeetingRoom::firstOrCreate(
                ['name' => $room['name']],
                $room
            );
        }
    }
}
