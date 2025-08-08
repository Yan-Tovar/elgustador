<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Productos;
use App\Models\Categorias;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;

class ProductosController extends Controller
{
    public function index()
    {
        $productos = Productos::with('categoria')->get();
        $usuario_rol = Session::get('usuario_rol');
        $categorias = Categorias::where('estado', '!=', 'Inhabilitada')->get();
        return view('productos', compact('productos', 'usuario_rol', 'categorias'));
    }

    public function create()
    {
        $categorias = Categorias::where('estado', '!=', 'Inhabilitada')->get();
        return view('productos.index', compact('categorias'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'descripcion' => 'nullable',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
            'categoria_id' => 'required|exists:categorias,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'estado' => 'required',
        ]);

        $datos = $request->except('imagen');

        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreImagen = time() . '.' . $imagen->getClientOriginalExtension();
            $imagen->storeAs('public/productos', $nombreImagen);
            $datos['imagen'] = $nombreImagen;
        }

        Productos::create($datos);

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente.');
    }

    public function edit(Productos $producto)
    {
        $categorias = Categorias::where('estado', '!=', 'Inhabilitada')->get();
        $usuario_rol = Session::get('usuario_rol');
        return view('productosEditar', compact('producto', 'categorias', 'usuario_rol'));
    }

    public function update(Request $request, Productos $producto)
    {
        $request->validate([
            'nombre' => 'required',
            'descripcion' => 'nullable',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
            'categoria_id' => 'required|exists:categorias,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $datos = $request->except('imagen');

        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior si existe
            if ($producto->imagen && Storage::exists('public/productos/' . $producto->imagen)) {
                Storage::delete('public/productos/' . $producto->imagen);
            }

            $imagen = $request->file('imagen');
            $nombreImagen = time() . '.' . $imagen->getClientOriginalExtension();
            $imagen->storeAs('productos', $nombreImagen, 'public');
            $datos['imagen'] = $nombreImagen;
        }

        $producto->update($datos);

        return redirect()->route('productos.index')->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Productos $producto)
    {
        if ($producto->imagen && Storage::exists('public/productos/' . $producto->imagen)) {
            Storage::delete('public/productos/' . $producto->imagen);
        }

        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado correctamente.');
    }
}
