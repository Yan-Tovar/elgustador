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
        Schema::table('productos', function (Blueprint $table) {
        // Añadir columna categoria_id (después puedes poner ->nullable() si es necesario)
        $table->unsignedBigInteger('categoria_id')->after('imagen');

        // Agregar la llave foránea a categorias.id
        $table->foreign('categoria_id')->references('id')->on('categorias')->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
        // Eliminar la foreign key primero
        $table->dropForeign(['categoria_id']);

        // Luego eliminar la columna
        $table->dropColumn('categoria_id');
    });
    }
};
