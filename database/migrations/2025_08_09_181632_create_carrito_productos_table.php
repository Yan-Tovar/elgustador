<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('carrito_productos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('carrito_id');
            $table->unsignedBigInteger('producto_id');
            $table->integer('cantidad')->default(1);
            $table->timestamps();

            // Relación con carrito
            $table->foreign('carrito_id')
                  ->references('id')->on('carrito')
                  ->onDelete('cascade');

            // Relación con productos
            $table->foreign('producto_id')
                  ->references('id')->on('productos')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrito_productos');
    }
};
