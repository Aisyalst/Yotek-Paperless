<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Master barang/aset. Setiap barang milik SATU perusahaan,
     * punya kode aset unik (AST-0001) + qr_token untuk QR code.
     *
     * status:
     *  - Tersedia : ada di gudang, belum dipegang siapa pun
     *  - Dipegang : sedang dipakai/dipegang karyawan (lihat asset_assignments)
     *  - Service  : sedang dalam perbaikan (lihat asset_services)
     *  - Rusak    : rusak, tidak bisa dipakai
     *  - Dihapuskan : sudah dihapus dari daftar aktif
     */
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code')->unique();
            $table->string('qr_token')->unique();
            $table->string('name');
            $table->foreignId('asset_category_id')->nullable()->constrained('asset_categories')->nullOnDelete();
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->string('supplier')->nullable();
            $table->string('condition')->default('Baik'); // Baik | Rusak Ringan | Rusak Berat
            $table->string('status')->default('Tersedia');
            $table->string('location')->nullable();
            $table->string('photo')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['company_id', 'status']);
            $table->index('asset_category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
