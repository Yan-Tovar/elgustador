<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioCustom extends Model
{
    use HasFactory;

    protected $table = 'usuarios_custom';

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'telefono',
        'direccion',
        'identificacion',
        'estado',
    ];

    protected $hidden = [
        'password',
    ];
}
