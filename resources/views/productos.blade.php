@extends('layouts.app')

    @section('content')

    <div class="container">
        <div class="-c-v4">
            <h4 class="-tx-v2">Gestion de Productos</h4>
        </div>
        <div class="-c-v4">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearProductoModal">
                Crear Producto
            </button>     
        </div>


        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif
        @if(!$productos || $productos->isEmpty())
            <div class="alert alert-warning mt-3">
                No hay productos.
            </div>
        @else

        <div class="row">
            @foreach($productos as $producto)
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <!-- Este es el contenedor de presentación para los productos -->
                        <br>
                        <div class="-c-v3">
                            <div class="-c-v4">
                                <div class="-e-v1">
                                    @if($producto->imagen)
                                        <img src="{{ asset('storage/productos/' . $producto->imagen) }}">
                                    @else
                                        <img src="{{ asset('imagenes/perfil_oculto.png') }}">
                                    @endif
                                </div>
                                <div class="-e-v1">
                                    <p><strong>{{ $producto->nombre }}</strong></p>
                                </div>
                            </div>
                            <div class="-c-v4">
                                <div class="-e-v2">
                                    <p><strong>$ {{ $producto->precio }}</strong></p>
                                </div>
                                <div class="-e-v2">
                                    <a href="Cliente_Producto.html">Más Información</a>
                                </div>
                            </div>
                            <hr>
                            <div class="-c-v4">
                                <a href="{{ route('productos.edit', $producto->id) }}" class="btn btn-primary">
                                    Editar
                                </a>
                                <form action="{{ route('productos.destroy', $producto) }}" method="POST" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                                </form>
                            </div>
                        </div>
                        <br>
                    <!-- Aquí finaliza el contenedor de presentación de productos -->
                </div>
            @endforeach
        </div>
        @endif
    </div>

    <!-- Modal para agregar Productos -->
    <div class="modal fade" id="crearProductoModal" tabindex="-1" aria-labelledby="crearProductoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <form action="{{ route('productos.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <input type="hidden" name="estado" value="Habilitado" >
                <div class="modal-header">
                <h5 class="modal-title" id="crearProductoLabel">Crear Producto</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                <div class="mb-3">
                    <label>Nombre</label>
                    <input type="text" name="nombre" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Descripción</label>
                    <textarea name="descripcion" class="form-control"></textarea>
                </div>
                <div class="mb-3">
                    <label>Precio</label>
                    <input type="number" step="0.01" name="precio" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Stock</label>
                    <input type="number" name="stock" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Categoría</label>
                    <select name="categoria_id" class="form-control" required>
                        @foreach($categorias as $categoria)
                            <option value="{{ $categoria->id }}">{{ $categoria->nombre }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="mb-3">
                    <label>Imagen</label>
                    <input type="file" name="imagen" class="form-control">
                </div>
                </div>
                <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Guardar</button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    
@endsection