@extends('layouts.app')

    @section('content')

    <div class="container">
        <h1>Apuntes</h1>

        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#crearApunteModal">
            Crear Apunte
        </button>

        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if(!$apuntes || $apuntes->isEmpty())
            <div class="alert alert-warning mt-3">
                No hay apuntes.
            </div>
        @else
            <table class="table mt-3">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Descripcion</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($apuntes as $apunte)
                        <tr>
                            
                            <td>{{ $apunte->titulo }}</td>
                            <td>{{ $apunte->descripcion }}</td>
                            <td>{{ $apunte->fecha }}</td>
                            <td>{{ $apunte->estado }}</td>
                            
                    
                            <td>
                                <a href="{{ route('apuntes.edit', $apunte->id) }}" class="btn btn-primary">
                                    Editar
                                </a>
                                <form action="{{ route('apuntes.destroy', $apunte) }}" method="POST" style="display:inline;">
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

    <!-- Modal para agregar apuntes -->
    <div class="modal fade" id="crearApunteModal" tabindex="-1" aria-labelledby="crearApunteLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form action="{{ route('apuntes.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                <input type="hidden" name="estado" value="activo">
                <input type="hidden" name="id_usuario" value="{{ auth()->id() }}"> <!-- Si usas autenticación de Laravel -->

                <div class="modal-header">
                    <h5 class="modal-title" id="crearApunteLabel">Crear Apunte</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <label for="titulo">Título</label>
                        <input type="text" id="titulo" name="titulo" class="form-control" required maxlength="255">
                    </div>
                    <div class="mb-3">
                        <label for="descripcion">Descripción</label>
                        <textarea id="descripcion" name="descripcion" class="form-control"></textarea>
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