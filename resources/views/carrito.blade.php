@extends('layouts.app') {{-- Si usas un layout principal --}}

@section('content')
<div class="container">
    <h1>Mi Carrito</h1>

    {{-- Si el carrito está vacío --}}
    @if($carritoProductos->isEmpty())
        <p>No tienes productos en tu carrito.</p>
        <a href="{{ route('productos.index') }}" class="btn btn-primary">Ver productos</a>
    @else
        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                @php $total = 0; @endphp
                @foreach($carritoProductos as $item)
                    @php 
                        $subtotal = $item->producto->precio * $item->cantidad;
                        $total += $subtotal;
                    @endphp
                    <tr>
                        <td>{{ $item->producto->nombre }}</td>
                        <td>${{ number_format($item->producto->precio, 2) }}</td>
                        <td>{{ $item->cantidad }}</td>
                        <td>${{ number_format($subtotal, 2) }}</td>
                        <td>
                            <form action="{{ route('carrito.eliminar', $item->producto->id) }}" method="POST">
                                @csrf
                                <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <h4>Total: ${{ number_format($total, 2) }}</h4>

        <form action="{{ route('checkout.procesar') }}" method="POST">
            @csrf
            <button type="submit" class="btn btn-success">Finalizar Compra</button>
        </form>
    @endif
</div>
@endsection
