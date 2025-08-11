<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use Illuminate\Http\Request;

class FacturaController extends Controller
{
    public function index()
    {
        $usuario_id = auth()->id();
        $facturas = Factura::where('usuario_id', $usuario_id)->with('detalles.producto')->get();

        return view('facturas.index', compact('facturas'));
    }

    public function show($id)
    {
        $factura = Factura::with('detalles.producto')
            ->where('usuario_id', auth()->id())
            ->findOrFail($id);

        return view('facturas.show', compact('factura'));
    }
}

