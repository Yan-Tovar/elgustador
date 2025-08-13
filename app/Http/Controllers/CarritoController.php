<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CarritoProducto; // Modelo del carrito
use Illuminate\Support\Facades\Auth;

class CarritoController extends Controller
{
    // Mostrar el carrito del usuario autenticado
    public function index()
    {
        // Obtenemos todos los productos del carrito del usuario logueado
        $carritoProductos = CarritoProducto::with('producto')
            ->where('usuario_id', Auth::id())
            ->get();

        // Enviar los datos a la vista
        return view('carrito', compact('carritoProductos'));
    }

    // Agregar un producto al carrito
    public function agregar(Request $request, $producto_id)
    {
        $item = CarritoProducto::where('usuario_id', Auth::id())
            ->where('producto_id', $producto_id)
            ->first();

        if ($item) {
            $item->cantidad += $request->input('cantidad', 1);
            $item->save();
        } else {
            CarritoProducto::create([
                'usuario_id' => Auth::id(),
                'producto_id' => $producto_id,
                'cantidad' => $request->input('cantidad', 1),
            ]);
        }

        return redirect()->route('carrito.index')->with('success', 'Producto agregado al carrito.');
    }

    // Eliminar un producto del carrito
    public function eliminarProducto($producto_id)
    {
        CarritoProducto::where('usuario_id', Auth::id())
            ->where('producto_id', $producto_id)
            ->delete();

        return redirect()->route('carrito.index')->with('success', 'Producto eliminado del carrito.');
    }
}
