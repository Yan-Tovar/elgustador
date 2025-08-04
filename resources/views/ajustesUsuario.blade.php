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
          <img src="Imagenes/usuario.jpg" class="-im-v3">
        </div>
        <br>
        <!-- Botón para abrir el modal -->
        <div class="-c-v4">
          <button class="-b-v4" onclick="abrirModal()">Cambiar Foto</button>
        </div>
        <br>
        <!-- Modal -->
        <div id="miModal" class="-c-v9">
          <div class="-e-v5">
            <span class="-e-v6" onclick="cerrarModal()">&times;</span>
            <h3>Sube una imagen</h3>
            <input type="file" accept="image/*" onchange="mostrarPreview(event)">
            <img id="preview" alt="Vista previa" class="-im-v2">
          </div>
        </div>
      </div>
      <br>
      <div class="col-sm-12 col-md-12 col-lg-5">
        <div class="-c-v4">Editar Datos Personales<i class="material-icons -e-v3">edit</i></div>
        <form class="-c-v3">
          <label>Nombre</label><br>
          <input type="text" value="{{ Session::get('usuario_nombre') }}" class="-b-v2" placeholder="Ingrese su Nombre" required>
          <br><label>Correo</label><br>
          <input type="text" value="{{ Session::get('usuario_email') }}" class="-b-v2" placeholder="Ingrese su Correo" required>
          <br><br>
          <button class="-b-v5">Guardar Cambios</button>
        </form>
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