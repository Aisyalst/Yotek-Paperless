<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UrgencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $urgencies = [
            ['title' => 'Low', 'level' => 1, 'color' => '#33cc33', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Medium', 'level' => 2, 'color' => '#ffcc00', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'High', 'level' => 3, 'color' => '#ff9900', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Critical', 'level' => 4, 'color' => '#ff3300', 'created_at' => now(), 'updated_at' => now()],
        ];
        
        \Illuminate\Support\Facades\DB::table('urgencies')->insert($urgencies);
    }
}
