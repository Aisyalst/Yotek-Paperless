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
        Schema::create('contract_information', function (Blueprint $table) {
            $table->id();
            $table->string('nik')->nullable();
            $table->string('contract_type')->nullable();
            $table->string('contract_number')->nullable();
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->integer('contract_duration')->nullable();
            $table->string('contract_sequence')->nullable();
            $table->string('contract_status')->nullable();
            $table->string('previous_contract')->nullable();
            $table->string('next_action')->nullable();
            $table->timestamps();

            $table->foreign('nik')->references('nik')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_information');
    }
};
