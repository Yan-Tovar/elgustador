<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\UsuarioCustom;
use Illuminate\Support\Facades\Storage;

class AjustesUsuarioController extends Controller
{
    public function show() {
        $id = session('usuario_id');
        $usuario_rol = session('usuario_rol');
        $usuario_foto = session('usuario_foto');

        if (!$id) {
            return redirect()->back()->with('error', 'No se encontró usuario en sesión.');
        }

        $usuario = UsuarioCustom::findOrFail($id);
        return view('ajustesUsuario', compact('usuario', 'usuario_rol', 'usuario_foto'));
    }

    public function update(Request $request) {
         $id = session('usuario_id');
    $usuario = UsuarioCustom::findOrFail($id);

    $request->validate([
        'identificacion' => 'required',
        'nombre' => 'required',
        'email' => 'required|email|unique:usuarios_custom,email,' . $usuario->id,
        'telefono' => 'nullable',
        'direccion' => 'nullable',
    ]);

    $usuario->update($request->only(['identificacion', 'nombre', 'email', 'telefono', 'direccion']));

    return redirect()->route('ajustesUsuario.show')->with('success', 'Usuario actualizado correctamente.');
    }

    
public function subir(Request $request) {
    $request->validate([
        'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $usuario_id = session('usuario_id');
    $usuario = UsuarioCustom::findOrFail($usuario_id);

    $fotoAnterior = $usuario->foto;

    // Si ya existe una foto, la eliminamos
    if ($fotoAnterior && Storage::exists('public/imagenes/' . $fotoAnterior)) {
        Storage::delete('public/imagenes/' . $fotoAnterior);
    }

    // Guardar la nueva foto
    $foto = $request->file('foto');
    $nombreFoto = time() . '.' . $foto->getClientOriginalExtension();
    $foto->storeAs('imagenes', $nombreFoto, 'public');


    // Actualizar en la base de datos
    $usuario->foto = $nombreFoto;
    $usuario->save();

    // Guardar en sesión si quieres mantenerla en sesión también
    session(['foto' => $nombreFoto]);

    return redirect()->route('ajustesUsuario.show')->with('success', 'Foto actualizada correctamente.');
}
}
