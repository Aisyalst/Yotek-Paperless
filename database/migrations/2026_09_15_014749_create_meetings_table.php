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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['online', 'on_room', 'hybrid']);
            $table->foreignId('meeting_room_id')->nullable()->constrained('meeting_rooms')->nullOnDelete();
            $table->enum('online_platform', ['Zoom', 'Google Meet', 'Ms Teams', 'other'])->nullable();
            $table->string('online_link')->nullable();
            $table->string('passcode')->nullable();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('organizer_nik');
            $table->foreign('organizer_nik')->references('nik')->on('users')->cascadeOnDelete();
            $table->enum('status', ['Terjadwal', 'Berjalan', 'Selesai', 'Dibatalkan'])->default('Terjadwal');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
