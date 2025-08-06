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
        Schema::table('usuarios_custom', function (Blueprint $table) {
        $table->string('telefono')->nullable();
        $table->string('direccion')->nullable();
        $table->string('identificacion')->nullable();
        $table->string('estado')->nullable();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuarios_custom', function (Blueprint $table) {
            $table->dropColumn(['telefono', 'direccion', 'identificacion', 'estado']);
        });
    }
};
