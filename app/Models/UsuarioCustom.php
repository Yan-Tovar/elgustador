<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioCustom extends Model
{
    use HasFactory;

    protected $table = 'usuarios_custom';  // Nombre de la tabla de Usuarios

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password',
    ];
}
