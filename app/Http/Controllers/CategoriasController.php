<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categorias;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;

class CategoriasController extends Controller
{
    public function index()
    {
        $categorias = Categorias::where('estado', '!=', 'Inhabilitada')->get();
        $usuario_rol = Session::get('usuario_rol');
        return view('categorias', compact('categorias', 'usuario_rol'));
    }

    public function create()
    {
        return view('categorias.index', compact());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'descripcion' => 'nullable',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'estado' => 'required',
        ]);

        $datos = $request->except('imagen');

        // Procesar imagen si existe
        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreImagen = time() . '.' . $imagen->getClientOriginalExtension();
            $imagen->storeAs('public/categorias', $nombreImagen);
            $datos['imagen'] = $nombreImagen;
        }

        // Crear categoría con todos los datos
        Categorias::create($datos);

        return redirect()->route('categorias.index')->with('success', 'Categoría creada correctamente.');
    }

    public function edit(Categorias $categoria)
    {
        $usuario_rol = Session::get('usuario_rol');
        return view('categoriasEditar', compact('categoria', 'usuario_rol'));
    }

    public function update(Request $request, Categorias $categoria)
    {
        $request->validate([
            'nombre' => 'required',
            'descripcion' => 'nullable',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $datos = $request->except('imagen');

        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior si existe
            if ($categoria->imagen && Storage::exists('public/categorias/' . $categoria->imagen)) {
                Storage::delete('public/categorias/' . $categoria->imagen);
            }

            $imagen = $request->file('imagen');
            $nombreImagen = time() . '.' . $imagen->getClientOriginalExtension();
            $imagen->storeAs('public/categorias', $nombreImagen);
            $datos['imagen'] = $nombreImagen;
        }

        $categoria->update($datos);

        return redirect()->route('categorias.index')->with('success', 'Categoria actualizada correctamente.');
    }

    public function destroy(Categorias $categoria)
    {
        // Cambiar el estado a "Inhabilitada" en lugar de eliminar
        $categoria->estado = 'Inhabilitada';
        $categoria->save();

        return redirect()->route('categorias.index')
                        ->with('success', 'La categoría ha sido inhabilitada correctamente.');
    }

}
