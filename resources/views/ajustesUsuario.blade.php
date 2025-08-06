@if(session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@if(session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif
@endif
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agustes Usuario</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

    <!-- Google Icons (Material Icons) -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Bootstrap CSS (v5.3.2) desde CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- CSS personalizado -->
    <link rel="stylesheet" href="{{ asset('css/EstiloObjetos.css') }}">
</head>
<body>
  <br><br>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-5">
        <div class="-c-v4">
          @if($usuario_foto)
              <img src="{{ asset('storage/imagenes/' . $usuario->foto) }}" class="-im-v3">
          @else
              <img src="{{ asset('imagenes/perfil_oculto.png') }}" class="-im-v3">
          @endif
        </div>
        <br>
        <!-- Formulario para subir foto -->
        <form action="{{ route('ajustesUsuario.subir') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mb-3">
                <input type="file" name="foto" class="form-control" required>
                @error('foto') <small class="text-danger">{{ $message }}</small> @enderror
            </div>
            <div class="-c-v4">
              <button type="submit" class="-b-v4" >Cambiar Foto</button>
            </div>
        </form>
        
        <br>
      </div>
      <br>
      <div class="col-sm-12 col-md-12 col-lg-5">
        <div class="-c-v4">Editar Datos Personales</div>
        <ul class="list-group">
          <li class="list-group-item"><strong>Identificación:</strong> {{ $usuario->identificacion }}</li>
          <li class="list-group-item"><strong>Nombre:</strong> <span id="nombre-display">{{ $usuario->nombre }}</span></li>
          <li class="list-group-item"><strong>Email:</strong> <span id="email-display">{{ $usuario->email }}</span></li>
          <li class="list-group-item"><strong>Teléfono:</strong> <span id="telefono-display">{{ $usuario->telefono }}</span></li>
          <li class="list-group-item"><strong>Dirección:</strong> <span id="direccion-display">{{ $usuario->direccion }}</span></li>
        </ul>

      <button class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#editarModal">Editar Usuario</button>

<!-- MODAL BOOTSTRAP -->
<div class="modal fade" id="editarModal" tabindex="-1" aria-labelledby="editarModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form action="{{ route('ajustesUsuario.update') }}" method="POST">
          @csrf
          @method('PUT')
          <div class="modal-header">
              <h5 class="modal-title" id="editarModalLabel">Editar Usuario</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <div class="mb-3">
                  <label for="identificacion" class="form-label">Identificacion</label>
                  <input type="text" class="form-control" id="identificacion" name="identificacion" value="{{ $usuario->identificacion }}">
              </div>
              <div class="mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="nombre" name="nombre" value="{{ $usuario->nombre }}">
              </div>
              <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" name="email" value="{{ $usuario->email }}">
              </div>
              <div class="mb-3">
                  <label for="telefono" class="form-label">Teléfono</label>
                  <input type="text" class="form-control" id="telefono" name="telefono" value="{{ $usuario->telefono }}">
              </div>
              <div class="mb-3">
                  <label for="direccion" class="form-label">Dirección</label>
                  <input type="text" class="form-control" id="direccion" name="direccion" value="{{ $usuario->direccion }}">
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




        <br>
        <!-- Button trigger modal -->
         <div class="-c-v4">
          <button onclick="sonido()" type="button" class="-b-v4" data-bs-toggle="modal" data-bs-target="#exampleModal">Cerrar Sesión</button>
          <audio id="notificacion-sonido" src="Imagenes/notification-tone-swift-gesture.ogg" preload="auto"></audio>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body">
                ¿Estás seguro de Cerrar Sesión?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <a href="{{ route('logout') }}"><button type="button" class="btn btn-primary">Cerrar</button></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    <!-- Contenedor Inferior (Barra navegación) -->
      @include('partials.accesoRapido')
    <!-- archivo JS Propio-->
    <script src="{{ asset('js/ScriptObjetos.js') }}"></script>
    <!-- Archivo JS Bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>