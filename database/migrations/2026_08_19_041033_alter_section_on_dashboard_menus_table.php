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
        Schema::table('dashboard_menus', function (Blueprint $table) {
            $table->unsignedBigInteger('section_id')->nullable()->after('parent_id');
            $table->foreign('section_id')->references('id')->on('dashboard_menu_sections')->onDelete('cascade');
        });

        // Data migration
        $menus = \Illuminate\Support\Facades\DB::table('dashboard_menus')->get();
        foreach ($menus as $menu) {
            $sectionName = $menu->section ?? 'Tables';
            $section = \Illuminate\Support\Facades\DB::table('dashboard_menu_sections')->where('name', $sectionName)->first();
            if (!$section) {
                $sectionId = \Illuminate\Support\Facades\DB::table('dashboard_menu_sections')->insertGetId([
                    'name' => $sectionName,
                    'order' => \Illuminate\Support\Facades\DB::table('dashboard_menu_sections')->count() + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $sectionId = $section->id;
            }
            \Illuminate\Support\Facades\DB::table('dashboard_menus')->where('id', $menu->id)->update(['section_id' => $sectionId]);
        }

        Schema::table('dashboard_menus', function (Blueprint $table) {
            $table->dropColumn('section');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dashboard_menus', function (Blueprint $table) {
            $table->dropForeign(['section_id']);
            $table->dropColumn('section_id');
        });
        Schema::table('dashboard_menus', function (Blueprint $table) {
            $table->enum('section', ['Tables', 'Settings'])->after('parent_id');
        });
    }
};
