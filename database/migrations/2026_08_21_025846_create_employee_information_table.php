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
        Schema::create('employee_information', function (Blueprint $table) {
            $table->id();
            $table->string('nik')->nullable();
            $table->string('company')->nullable();
            $table->string('branch')->nullable();
            $table->string('department')->nullable();
            $table->foreignId('employee_rank_id')->nullable()->constrained('employee_ranks')->nullOnDelete();
            $table->string('direct_supervisor')->nullable();
            $table->string('employment_status')->nullable();
            $table->date('join_date')->nullable();
            $table->date('effective_date')->nullable();
            $table->timestamps();

            $table->foreign('nik')->references('nik')->on('users')->onDelete('cascade');
            $table->foreign('direct_supervisor')->references('nik')->on('users')->onDelete('set null');
        });

        Schema::table('devisions', function (Blueprint $table) {
            $table->foreign('head')->references('nik')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devisions', function (Blueprint $table) {
            $table->dropForeign(['head']);
        });

        Schema::dropIfExists('employee_information');
    }
};
