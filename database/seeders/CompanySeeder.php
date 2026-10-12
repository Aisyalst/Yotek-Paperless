<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        // Nama perusahaan harus sama dengan nilai `company` pada data karyawan
        // (employee_data.json). Daftar cabang diisi oleh MainEmployeeData.
        $companies = [
            'Yogura Tekindo',
            'Sumber Display Dunia',
            'Seriyus Hutama',
            'Indo Riau Perkasa',
            'Sumber Daya Alamindo',
            'Hunian Hijau Indonesia',
            'Epta Solusi Indonesia',
            'Cipta',
            'Gerbang Lautan Indonesia',
        ];

        foreach ($companies as $name) {
            Company::firstOrCreate(['name' => $name]);
        }
    }
}
