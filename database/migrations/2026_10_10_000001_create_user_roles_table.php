<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Mengubah relasi user<->role dari 1:1 (users.role_id) menjadi
     * many-to-many (tabel pivot user_roles) agar satu karyawan bisa
     * memiliki banyak role. Kolom users.role_id yang kini mubazir dihapus.
     */
    public function up(): void
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'role_id']);
        });

        // Migrasikan data lama: role_id tiap user menjadi baris pivot (primary).
        DB::table('users')
            ->whereNotNull('role_id')
            ->orderBy('id')
            ->chunkById(500, function ($users) {
                $rows = [];
                foreach ($users as $u) {
                    $rows[] = [
                        'user_id' => $u->id,
                        'role_id' => $u->role_id,
                        'is_primary' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                if (!empty($rows)) {
                    DB::table('user_roles')->insertOrIgnore($rows);
                }
            });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id')->nullable()->after('is_active');
        });

        // Kembalikan role primary ke users.role_id.
        $primaries = DB::table('user_roles')->where('is_primary', true)->get();
        foreach ($primaries as $p) {
            DB::table('users')->where('id', $p->user_id)->update(['role_id' => $p->role_id]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('roles')->cascadeOnDelete();
        });

        Schema::dropIfExists('user_roles');
    }
};
