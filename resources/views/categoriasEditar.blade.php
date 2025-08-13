@extends('layouts.app')

    @section('content')


                <form action="{{ route('categorias.update', $categoria->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <input type="hidden" name="id" value="{{ $categoria->id }}">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editarCategoriaModalLabel">Editar Producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" name="nombre" value="{{ $categoria->nombre }}" required>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea class="form-control" id="descripcion" name="descripcion">{{ $categoria->descripcion }}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="imagen" class="form-label">Imagen (opcional)</label>
                            <input type="file" class="form-control" id="imagen" name="imagen">
                            @if($categoria->imagen)
                                <small>Imagen actual: {{ $categoria->imagen }}</small>
                            @endif
                        </div>
                    </div>
                    <button type="submit">Actualizar</button>
                </form>
                <br><br><br>


    
@endsection