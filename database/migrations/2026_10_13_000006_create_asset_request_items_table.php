<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Detail item yang diminta dalam satu pengajuan (multi-item).
     */
    public function up(): void
    {
        Schema::create('asset_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_request_id')->constrained('asset_requests')->cascadeOnDelete();
            $table->foreignId('asset_category_id')->nullable()->constrained('asset_categories')->nullOnDelete();
            $table->string('item_name');
            $table->integer('qty')->default(1);
            $table->string('unit')->nullable();
            $table->decimal('estimated_price', 15, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_request_items');
    }
};
