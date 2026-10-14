<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * HISTORY pemegang barang (serah-terima berkali-kali).
     * Baris dengan status = 'Aktif' = pemegang SAAT INI.
     * Saat barang dikembalikan: isi returned_date, ubah status jadi 'Dikembalikan'.
     */
    public function up(): void
    {
        Schema::create('asset_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('employee_nik');
            $table->date('assigned_date');
            $table->date('returned_date')->nullable();
            $table->string('condition_on_assign')->nullable();
            $table->string('condition_on_return')->nullable();
            $table->string('status')->default('Aktif'); // Aktif | Dikembalikan
            $table->string('assigned_by_nik')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('employee_nik')->references('nik')->on('users')->cascadeOnDelete();
            $table->foreign('assigned_by_nik')->references('nik')->on('users')->nullOnDelete();
            $table->index(['asset_id', 'status']);
            $table->index('employee_nik');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_assignments');
    }
};
