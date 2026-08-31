<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = ['Yotek', 'SDD', 'SH', 'IRP'];
        
        $branches = [
            [
                'region' => 'Jawa',
                'province' => 'Banten',
                'city' => 'Tangerang',
            ],
            [
                'region' => 'Sumatera',
                'province' => 'Riau',
                'city' => 'Pekanbaru',
            ]
        ];

        foreach ($companies as $name) {
            Company::firstOrCreate(
                ['name' => $name],
                ['branch' => $branches]
            );
        }
    }
}
