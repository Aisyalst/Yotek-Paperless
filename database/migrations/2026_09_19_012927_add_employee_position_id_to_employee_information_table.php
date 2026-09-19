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
        Schema::table('employee_information', function (Blueprint $table) {
            $table->foreignId('employee_position_id')->nullable()->constrained('employee_positions')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_information', function (Blueprint $table) {
            $table->dropForeign(['employee_position_id']);
            $table->dropColumn('employee_position_id');
        });
    }
};
