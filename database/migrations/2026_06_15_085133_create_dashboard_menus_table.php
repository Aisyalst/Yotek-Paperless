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
        Schema::create('dashboard_menus', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->enum('section', ['Tables', 'Settings']);
            $table->enum('type', ['Single', 'Dropdown'])->default('Single');
            $table->unsignedBigInteger('route_id')->nullable();
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('dashboard_menus')->onDelete('cascade');
            $table->foreign('route_id')->references('id')->on('routes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_menus');
    }
};
