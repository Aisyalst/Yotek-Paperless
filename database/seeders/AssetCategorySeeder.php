<?php

namespace Database\Seeders;

use App\Models\AssetCategory;
use Illuminate\Database\Seeder;

class AssetCategorySeeder extends Seeder
{
    /**
     * Kategori barang default untuk modul GA.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Elektronik',        'description' => 'Komputer, laptop, monitor, printer, dll', 'order' => 1],
            ['name' => 'Furniture',         'description' => 'Meja, kursi, lemari, rak, dll',           'order' => 2],
            ['name' => 'Kendaraan',         'description' => 'Mobil, motor, dan kendaraan operasional', 'order' => 3],
            ['name' => 'Peralatan Kantor',  'description' => 'Alat tulis, peralatan kantor lainnya',    'order' => 4],
            ['name' => 'Mesin & Peralatan', 'description' => 'AC, genset, mesin produksi, dll',         'order' => 5],
            ['name' => 'Lainnya',           'description' => 'Barang lain yang belum terkategori',      'order' => 6],
        ];

        foreach ($categories as $category) {
            AssetCategory::updateOrCreate(
                ['name' => $category['name']],
                $category
            );
        }
    }
}
