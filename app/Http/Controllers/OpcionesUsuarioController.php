<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class OpcionesUsuarioController extends Controller
{
    public function index()
    {
        // Verificar sesión iniciada
        if (!Session::has('usuario_id')) {
            return redirect()->route('login');
        }

        $usuario_nombre = Session::get('usuario_nombre');
        $usuario_rol = Session::get('usuario_rol');
        $usuario_foto = session('usuario_foto');

        return view('opcionesUsuario', compact('usuario_nombre', 'usuario_rol', 'usuario_foto'));
    }
}
