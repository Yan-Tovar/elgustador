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
    
        Schema::create('apuntes', function (Blueprint $table) {
            $table->id(); // Campo id
            $table->string('titulo'); // Campo titulo
            $table->text('descripcion')->nullable(); // Campo descripcion (puede ser nullable si lo deseas)
            $table->date('fecha'); // Campo fecha
            $table->string('estado'); // Campo estado
            $table->unsignedBigInteger('id_usuario'); // Campo id_usuario (clave foránea)
            
            // Definición de clave foránea
            $table->foreign('id_usuario')
                  ->references('id')
                  ->on('usuarios_custom')
                  ->onDelete('cascade'); // Opcional: elimina apuntes si se elimina el usuario

            $table->timestamps(); // created_at y updated_at
        });
    

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         
        Schema::dropIfExists('apuntes');
    
    }
};
