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
        Schema::table('approval_workflow_steps', function (Blueprint $table) {
            $table->string('approver_type')->default('specific_user')->after('approval_level');
            $table->string('approver_nik')->nullable()->change();
            $table->string('employee_role')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('approval_workflow_steps', function (Blueprint $table) {
            $table->dropColumn('approver_type');
            $table->string('approver_nik')->nullable(false)->change();
            $table->string('employee_role')->nullable(false)->change();
        });
    }
};
