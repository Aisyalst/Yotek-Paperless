<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Header pengajuan barang (multi-item).
     * status : Pending | Approved | Rejected | Fulfilled
     * priority: Rendah | Normal | Tinggi | Urgent
     */
    public function up(): void
    {
        Schema::create('asset_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->string('employee_nik');
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->string('department')->nullable();
            $table->date('request_date');
            $table->date('needed_date')->nullable();
            $table->text('purpose')->nullable();
            $table->string('priority')->default('Normal');
            $table->string('status')->default('Pending');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('employee_nik')->references('nik')->on('users')->cascadeOnDelete();
            $table->index(['employee_nik', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_requests');
    }
};
