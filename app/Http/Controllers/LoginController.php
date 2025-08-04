<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UsuarioCustom;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    public function autenticar(Request $request)
    {
        $credenciales = $request->only('email', 'password');

        $usuario = UsuarioCustom::where('email', $credenciales['email'])->first();

        if ($usuario && Hash::check($credenciales['password'], $usuario->password)) {
            // Guardar en sesión
            Session::put('usuario_id', $usuario->id);
            Session::put('usuario_nombre', $usuario->nombre);
            Session::put('usuario_email', $usuario->email);
            Session::put('usuario_rol', $usuario->rol);

            return redirect('/dashboard');
            
        } else {
            return redirect()->route('login')->with('error', 'Credenciales incorrectas');
        }
    }
}
