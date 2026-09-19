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
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->string('consequence')->nullable()->after('deduction_type');
            $table->integer('deducted_leave_days')->default(0)->after('consequence');
            $table->integer('deducted_salary_days')->default(0)->after('deducted_leave_days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->dropColumn(['consequence', 'deducted_leave_days', 'deducted_salary_days']);
        });
    }
};

