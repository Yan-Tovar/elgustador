@extends('layouts.app')

    @section('content')


                <form action="{{ route('apuntes.update', $apunte->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <input type="hidden" name="id" value="{{ $apunte->id }}">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editarapunteModalLabel">Editar apunte</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="tiutulo" class="form-label">Titulo</label>
                            <input type="text" class="form-control" id="titulo" name="titulo" value="{{ $apunte->titulo }}" required>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea class="form-control" id="descripcion" name="descripcion">{{ $apunte->descripcion }}</textarea>
                        </div>
                    </div>
                    <button type="submit">Actualizar</button>
                </form>
                <br><br><br>


    
@endsection