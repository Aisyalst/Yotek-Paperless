<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tiket service/perbaikan barang.
     * service_type : Preventive | Corrective | Perbaikan
     * status       : Diajukan | Proses | Selesai | Batal
     */
    public function up(): void
    {
        Schema::create('asset_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('service_number')->unique();
            $table->string('service_type')->default('Perbaikan');
            $table->date('service_date');
            $table->string('vendor')->nullable();
            $table->text('complaint')->nullable();
            $table->text('action_taken')->nullable();
            $table->decimal('cost', 15, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('completed_date')->nullable();
            $table->string('status')->default('Diajukan');
            $table->text('result')->nullable();
            $table->string('attachment')->nullable();
            $table->string('created_by_nik')->nullable();
            $table->timestamps();

            $table->foreign('created_by_nik')->references('nik')->on('users')->nullOnDelete();
            $table->index(['asset_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_services');
    }
};
