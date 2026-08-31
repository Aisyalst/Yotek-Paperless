<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeRank;

class EmployeeRankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranks = [
            'Junior Analyst',
            'Analyst',
            'Senior Analyst',
            'Junior Associate',
            'Associate',
            'Senior Associate',
            'Manager',
        ];

        foreach ($ranks as $index => $rank) {
            EmployeeRank::firstOrCreate(
                ['title' => $rank],
                ['order' => $index + 1]
            );
        }
    }
}
