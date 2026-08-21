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
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('request_date');
            $table->string('request_type');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->integer('duration_days')->nullable();
            $table->boolean('has_doctor_note')->nullable();
            $table->string('permission_type')->nullable();
            $table->time('permission_start_time')->nullable();
            $table->time('permission_end_time')->nullable();
            $table->string('deduction_type')->nullable();
            $table->string('special_leave_type')->nullable();
            $table->text('reason')->nullable();
            $table->text('work_delegation')->nullable();
            $table->string('status')->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
