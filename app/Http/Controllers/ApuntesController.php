<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Apuntes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;

class ApuntesController extends Controller
{
  public function index()
{
    $id_usuario = Session::get('usuario_id'); // Asegúrate de que este valor esté seteado en la sesión

    // Consulta con condiciones encadenadas para obtener los apuntes del usuario con estado 'activo'
    $apuntes = Apuntes::with('Usuarios_Custom')
                ->where('id_usuario', $id_usuario)  // Filtro por el ID del usuario
                ->where('estado', 'activo')  // Filtro por el estado 'activo'
                ->get();

    // Obtener el rol del usuario desde la sesión
    $usuario_rol = Session::get('usuario_rol');

    // Retornar la vista con los apuntes y el rol del usuario
    return view('apuntes', compact('apuntes', 'usuario_rol'));
}

    public function create()
    {
      
    }

    public function store(Request $request)

{
    // Validación de los datos
    $request->validate([
        'titulo' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'estado' => 'required|string|max:50',
    ]);

    // Obtener el ID del usuario actual desde la sesión o autenticación
    $id_usuario = session::get('usuario_id'); // Usando el sistema de autenticación de Laravel

    // Crear el apunte con la fecha automáticamente establecida
    Apuntes::create([
        'titulo' => $request->input('titulo'),
        'descripcion' => $request->input('descripcion'),
        'estado' => 'activo', // Se establece 'activo' de forma predeterminada
        'fecha' => now(), // Fecha actual automáticamente
        'id_usuario' => $id_usuario, // ID del usuario autenticado
    ]);

    // Redirigir al índice de apuntes con un mensaje de éxito
    return redirect()->route('apuntes.index')->with('success', 'Apunte creado correctamente.');
}

    public function edit(Apuntes $apunte)
    {
        $usuario_rol = Session::get('usuario_rol');
        return view('apuntesEditar', compact('apunte','usuario_rol'));
    }

    public function update(Request $request, Apuntes $apunte)
{
    // Validación de los datos
    $request->validate([
        'titulo' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
    ]);

    // Obtener los datos del formulario (solo los campos que quieres actualizar)
    $datos = $request->only(['titulo', 'descripcion']); // Solo 'titulo' y 'descripcion'

    // Actualizar el apunte con los nuevos datos
    $apunte->update($datos);

    // Redirigir al índice de apuntes con un mensaje de éxito
    return redirect()->route('apuntes.index')->with('success', 'Apunte actualizado correctamente.');
}

      public function destroy(Apuntes $apunte)
    {
        // Cambiar el estado a "inactivo" en lugar de eliminar
        $apunte->estado = 'inactivo';
        $apunte->save();

        return redirect()->route('apuntes.index')
                        ->with('success', 'el apunte esta inactivo.');
    }

}
