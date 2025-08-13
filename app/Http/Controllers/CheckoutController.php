<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\CarritoProducto;
use App\Models\Factura;
use App\Models\DetalleFactura;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function procesar()
    {
        $usuario_id = auth()->id();
        $carrito = Carrito::with('productos.producto')->where('usuario_id', $usuario_id)->first();

        if (!$carrito || $carrito->productos->isEmpty()) {
            return redirect()->route('carrito.index')->with('error', 'Carrito vacío');
        }

        DB::transaction(function () use ($carrito, $usuario_id) {
            // Calcular total
            $total = 0;
            foreach ($carrito->productos as $item) {
                $total += $item->producto->precio * $item->cantidad;
            }

            // Crear factura
            $factura = Factura::create([
                'usuario_id' => $usuario_id,
                'total' => $total
            ]);

            // Crear detalles de factura
            foreach ($carrito->productos as $item) {
                DetalleFactura::create([
                    'factura_id' => $factura->id,
                    'producto_id' => $item->producto_id,
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => $item->producto->precio
                ]);
            }

            // Vaciar carrito
            CarritoProducto::where('carrito_id', $carrito->id)->delete();
        });

        return redirect()->route('facturas.index')->with('success', 'Compra realizada con éxito');
    }
}

