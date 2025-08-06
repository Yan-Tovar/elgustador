@extends('layouts.app')

    @section('content')
    <div class="container">
        <h1>Lista de Productos</h1>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearProductoModal">
            Crear Producto
        </button>


        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <table class="table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                @foreach($productos as $producto)
                <tr>
                    <td>{{ $producto->nombre }}</td>
                    <td>{{ $producto->categoria->nombre }}</td>
                    <td>{{ $producto->precio }}</td>
                    <td>{{ $producto->stock }}</td>
                    <td>
                        @if($producto->imagen)
                            <img src="{{ asset('storage/productos/' . $producto->imagen) }}" width="80">
                        @else
                            <img src="{{ asset('imagenes/perfil_oculto.png') }}" class="-im-v3">
                        @endif
                    </td>
                    <td>
                        <a href="{{ route('productos.edit', $producto->id) }}" class="btn btn-primary">
                            Editar Producto
                        </a>
                        <form action="{{ route('productos.destroy', $producto) }}" method="POST" style="display:inline;">
                            @csrf @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Modal para agregar Productos -->
    <div class="modal fade" id="crearProductoModal" tabindex="-1" aria-labelledby="crearProductoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <form action="{{ route('productos.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
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
    <!-- Modal para editar Productos -->
        <div class="modal fade" id="editarProductoModal" tabindex="-1" aria-labelledby="editarProductoModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <form action="{{ route('productos.update', $producto->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <input type="hidden" name="id" value="{{ $producto->id }}">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editarProductoModalLabel">Editar Producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" name="nombre" value="{{ $producto->nombre }}" required>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea class="form-control" id="descripcion" name="descripcion">{{ $producto->descripcion }}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="precio" class="form-label">Precio</label>
                            <input type="number" step="0.01" class="form-control" id="precio" name="precio" value="{{ $producto->precio }}" required>
                        </div>
                        <div class="mb-3">
                            <label for="stock" class="form-label">Stock</label>
                            <input type="number" class="form-control" id="stock" name="stock" value="{{ $producto->stock }}" required>
                        </div>
                        <div class="mb-3">
                            <label for="categoria_id" class="form-label">Categoría</label>
                            <select class="form-control" id="categoria_id" name="categoria_id" required>
                                @foreach($categorias as $categoria)
                                    <option value="{{ $categoria->id }}" {{ $producto->categoria_id == $categoria->id ? 'selected' : '' }}>
                                        {{ $categoria->nombre }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="imagen" class="form-label">Imagen (opcional)</label>
                            <input type="file" class="form-control" id="imagen" name="imagen">
                            @if($producto->imagen)
                                <small>Imagen actual: {{ $producto->imagen }}</small>
                            @endif
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
                </div>
            </div>
        </div>

    
@endsection