@extends('layouts.app')

    @section('content')

    <div class="container">
        <h1>Lista de Categorias</h1>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearCategoriaModal">
            Crear Categoria
        </button>

        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if(!$categorias || $categorias->isEmpty())
            <div class="alert alert-warning mt-3">
                No hay categorias.
            </div>
        @else
            <table class="table mt-3">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($categorias as $categoria)
                        <tr>
                            
                            <td>{{ $categoria->nombre }}</td>
                            <td>{{ $categoria->descripcion }}</td>
                            <td>
                                @if($categoria->imagen)
                                    <img src="{{ asset('storage/categorias/' . $categoria->imagen) }}" width="100 px">
                                @else
                                    <img src="{{ asset('imagenes/perfil_oculto.png') }}" width="100 px">
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('categorias.edit', $categoria->id) }}" class="btn btn-primary">
                                    Editar
                                </a>
                                <form action="{{ route('categorias.destroy', $categoria) }}" method="POST" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    <!-- Modal para agregar Categoria -->
    <div class="modal fade" id="crearCategoriaModal" tabindex="-1" aria-labelledby="crearCateogoriaLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <form action="{{ route('categorias.store') }}" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="estado" value="Habilitada">
                @csrf
                <div class="modal-header">
                <h5 class="modal-title" id="crearCategoriaLabel">Crear Producto</h5>
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