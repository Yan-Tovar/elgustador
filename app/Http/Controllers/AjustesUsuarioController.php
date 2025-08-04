<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class AjustesUsuarioController extends Controller
{
    public function index()
    {
        // Verificar sesión iniciada
        if (!Session::has('usuario_id')) {
            return redirect()->route('login');
        }

        $usuario_nombre = Session::get('usuario_nombre');
        $usuario_email = Session::get('usuario_email');
        $usuario_rol = Session::get('usuario_rol');

        return view('ajustesUsuario', compact('usuario_nombre', 'usuario_email', 'usuario_rol'));
    }
}
