<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Productos;
use Illuminate\Support\Facades\Session;

class DashboardController extends Controller
{
    public function index()
    {
        // Verificar si la sesión existe
        if (!Session::has('usuario_id')) {
            return redirect()->route('login');
        }

        // Obtener datos de la sesión
        $usuario_nombre = Session::get('usuario_nombre');
        $usuario_rol = Session::get('usuario_rol');
        $usuario_identificacion = Session::get('usuario_identificacion');
        $usuario_direccion = Session::get('usuario_direccion');
        $productos = Productos::where('estado', '!=', 'Activo')->get();

        return view('dashboard', compact('productos', 'usuario_nombre', 'usuario_rol', 'usuario_identificacion', 'usuario_direccion'));
    }
}
