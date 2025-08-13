<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apuntes extends Model
{
    use HasFactory;

    // Define los campos que se pueden rellenar
    protected $fillable = ['titulo', 'descripcion', 'fecha', 'estado', 'id_usuario'];

    // Relación con la tabla usuarios_custom
    public function usuarios_custom()
    {
        return $this->belongsTo(UsuarioCustom::class, 'id_usuario'); // Especifica la clave foránea
    }
}
