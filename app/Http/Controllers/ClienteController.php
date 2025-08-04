<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ClienteController extends Controller
{
    public function dashboard()
    {
        return view('dashboard', [
            'usuario_nombre' => Session::get('usuario_nombre'),
            'usuario_rol' => Session::get('usuario_rol'),
        ]);
    }

}
