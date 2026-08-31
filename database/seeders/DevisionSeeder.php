<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Devision;

class DevisionSeeder extends Seeder
{
    public function run(): void
    {
        $devisions = ['Digital Support', 'HR', 'Finance', 'GA'];
        foreach ($devisions as $name) {
            Devision::firstOrCreate(['name' => $name]);
        }
    }
}
