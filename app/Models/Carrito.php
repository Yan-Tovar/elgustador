<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrito extends Model
{
    protected $table = 'carrito';
    protected $fillable = ['usuario_id'];

    public function usuario()
    {
        return $this->belongsTo(UsuarioCustom::class, 'usuario_id');
    }

    public function productos()
    {
        return $this->hasMany(CarritoProducto::class, 'carrito_id');
    }
}
