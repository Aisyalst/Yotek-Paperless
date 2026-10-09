<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tabel penempatan kerja (employment) seorang karyawan.
     * Satu karyawan (nik) boleh punya BANYAK baris di sini:
     * - multi-perusahaan (mis. Vera: SDA + EPTA + CYLI + SDD)
     * - multi-role/jabatan dalam 1 perusahaan (mis. Kelly: HR + Purchasing + GA Manager)
     *
     * Baris dengan is_primary = true adalah penempatan UTAMA, dan dicerminkan
     * juga ke tabel employee_information (1:1 dengan users) supaya kode lama
     * yang memakai $user->employeeInformation tetap jalan.
     */
    public function up(): void
    {
        Schema::create('employee_employments', function (Blueprint $table) {
            $table->id();
            $table->string('nik');
            $table->string('company')->nullable();
            $table->string('branch')->nullable();
            $table->string('department')->nullable();
            $table->foreignId('employee_position_id')->nullable()->constrained('employee_positions')->nullOnDelete();
            $table->foreignId('employee_rank_id')->nullable()->constrained('employee_ranks')->nullOnDelete();
            $table->string('direct_supervisor')->nullable();
            $table->string('employment_status')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->date('join_date')->nullable();
            $table->timestamps();

            $table->foreign('nik')->references('nik')->on('users')->onDelete('cascade');
            $table->foreign('direct_supervisor')->references('nik')->on('users')->onDelete('set null');

            // Idempotency: satu kombinasi penempatan unik per karyawan.
            $table->unique(
                ['nik', 'company', 'department', 'employee_position_id'],
                'employee_employments_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_employments');
    }
};
