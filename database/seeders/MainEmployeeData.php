<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MainEmployeeData extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // All Company seeder
        $com = [
            'Yogura Tekindo',
            'Indo Riau Perkasa',
            'Seriyus Hutama',
            'Sumber Daya Alamindo',
            'Hunian Hijau Indonesia',
            'Epta Solusi Indonesia',
            'Cipta',
            'Gerbang Lautan Indonesia',
            'Sumber Display Dunia',
        ];
        $city = [
            [
                "city" => "Tangerang",
                "region" => "Jawa",
                "province" => "Banten"
            ],
            [
                "city" => "Pekanbaru",
                "region" => "Sumatera",
                "province" => "Riau"
            ]
        ];
        
        foreach ($com as $key => $value) {
            \App\Models\Company::create([
                'name' => $value,
            ]);
        }

        //All Division
        $devisions = [
            'Finance',
            'Finance - Kasir',
            'Finance - Account Receivable (AR)',
            'Digital Support',
            'Accounting',
            'Human Resource (HR) & Legal',
            'Purchasing',
            'General Affair (GA) & IT',
            'Logistik',
            'Business Development (BD)',
            'Technical Product',
            'Technical Support',
            'HSE',
            'Admin Tender',
        ];
        foreach ($devisions as $name) {
            \App\Models\Devision::create([
                'name' => $name,
            ]);
        }

        //Employee Position
        $position = [
            'Manager',
            'Head',
            'Supervisor',
            'Staff',
            'Admin',
            'Office Girl',
            'Office Boy',
            'Driver Operasional',
            'Administrasi & Kasir',
            'Driver',
            'Senior',
        ];
        foreach ($position as $name) {
            \App\Models\EmployeePosition::create([
                'name' => $name,
            ]);
        }
    }
}
