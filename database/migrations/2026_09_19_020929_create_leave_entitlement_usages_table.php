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
        Schema::create('leave_entitlement_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leave_entitlement_id')->constrained()->onDelete('cascade');
            $table->foreignId('leave_request_id')->constrained()->onDelete('cascade');
            $table->integer('deducted_days');
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_entitlement_usages');
    }
};
