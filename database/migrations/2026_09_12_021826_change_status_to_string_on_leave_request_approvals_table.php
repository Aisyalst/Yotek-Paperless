<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('leave_request_approvals', function (Blueprint $table) {
            $table->string('status')->default('Pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_request_approvals', function (Blueprint $table) {
            // Note: Reverting to enum might lose data if there are 'Auto Reject' statuses
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending')->change();
        });
    }
};
