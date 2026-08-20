<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['title' => 'Pending', 'type' => 'Form', 'color' => '#ffcc00', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Approved', 'type' => 'Form', 'color' => '#33cc33', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Rejected', 'type' => 'Form', 'color' => '#ff3300', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Draft', 'type' => 'Kontrak', 'color' => '#999999', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Active', 'type' => 'Kontrak', 'color' => '#33cc33', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Expired', 'type' => 'Kontrak', 'color' => '#ff3300', 'created_at' => now(), 'updated_at' => now()],
        ];
        
        \Illuminate\Support\Facades\DB::table('statuses')->insert($statuses);
    }
}
