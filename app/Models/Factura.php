<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    protected $table = 'factura';
    protected $fillable = ['usuario_id', 'total'];

    public function usuario()
    {
        return $this->belongsTo(UsuarioCustom::class, 'usuario_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleFactura::class, 'factura_id');
    }
}

