<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Approval pengajuan barang (multi-level, mengikuti pola leave_request_approvals).
     * status : Pending | Approved | Rejected
     */
    public function up(): void
    {
        Schema::create('asset_request_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_request_id')->constrained('asset_requests')->cascadeOnDelete();
            $table->integer('approver_level');
            $table->string('approver_nik');
            $table->string('approver_role')->nullable();
            $table->string('status')->default('Pending');
            $table->text('notes')->nullable();
            $table->longText('signature')->nullable();
            $table->timestamp('acted_at')->nullable();
            $table->timestamps();

            $table->foreign('approver_nik')->references('nik')->on('users')->cascadeOnDelete();
            $table->index(['asset_request_id', 'approver_level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_request_approvals');
    }
};
