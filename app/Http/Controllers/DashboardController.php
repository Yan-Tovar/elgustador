<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        return view('dashboard', compact('usuario_nombre', 'usuario_rol'));
    }
}
