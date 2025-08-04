<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuario</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

    <!-- Google Icons (Material Icons) -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Bootstrap CSS (v5.3.2) desde CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- CSS personalizado -->
    <link rel="stylesheet" href="{{  asset('css/EstiloObjetos.css') }}">
</head>
<body>
  <br><br>
  <div class="container">
    <div class="row">
      <div class="col-4">
        <div class="-c-v4">
           <img src="Imagenes/usuario.jpg" class="-im-v2">
        </div>
      </div>
      <div class="col-4">
        <div class="-c-v4-v3">
          <div class="-c-v4"><h4 class="-tx-v2-v1">{{ Session::get('usuario_nombre') }}</h4></div>
          @if($usuario_rol == 'Administrador')
            <div class="-c-v4"><h5 class="-tx-v2">Administrador</h5></div>
          @elseif($usuario_rol == 'Empleado')
            <div class="-c-v4"><h5 class="-tx-v2">Empleado</h5></div> 
          @elseif($usuario_rol == 'Cliente')
            <div class="-c-v4"><h5 class="-tx-v2">Cliente</h5></div>
          @endif
        </div>
      </div>
      <div class="col-4">
        <div class="-c-v4-v3">
          <div class="-c-v4"><a href="{{ route('ajustesUsuario') }}"><i class="material-icons md-50">settings</i></a> </div>
        </div>
      </div>
    </div>
    @if($usuario_rol == 'Administrador')
              <div class="row">
                <br>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <br>
                  <a href="Administrador_Configuracion.html"><div class="-c-v3-v1">
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">settings</i>
                    </div>
                    <div class="-e-v1">
                      <h4 class="-tx-v2">Configurción</h4>
                    </div>
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">arrow_forward_ios</i>
                    </div>
                  </div></a>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <br>
                  <a href="Administrador_EstadisticasYReportes_General.html"><div class="-c-v3-v1">
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">equalizer</i>
                    </div>
                    <div class="-e-v1">
                      <h4 class="-tx-v2">Estadísticas</h4>
                    </div>
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">arrow_forward_ios</i>
                    </div>
                  </div></a>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <br>
                  <a href="Administrador_GestionUsuario_General.html"><div class="-c-v3-v1">
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">person</i>
                    </div>
                    <div class="-e-v1">
                      <h4 class="-tx-v2">Gestión de us</h4>
                    </div>
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">arrow_forward_ios</i>
                    </div>
                  </div></a>
                </div>
                <br>
              </div>
              <br>
              <div class="row">
                <br>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <br>
                  <a href="Administrador_Configuracion.html"><div class="-c-v3-v1">
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">settings</i>
                    </div>
                    <div class="-e-v1">
                      <h4 class="-tx-v2">Configurción</h4>
                    </div>
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">arrow_forward_ios</i>
                    </div>
                  </div></a>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <br>
                  <a href="Administrador_EstadisticasYReportes_General.html"><div class="-c-v3-v1">
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">equalizer</i>
                    </div>
                    <div class="-e-v1">
                      <h4 class="-tx-v2">Estadísticas</h4>
                    </div>
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">arrow_forward_ios</i>
                    </div>
                  </div></a>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <br>
                  <a href="Administrador_GestionUsuario_General.html"><div class="-c-v3-v1">
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">person</i>
                    </div>
                    <div class="-e-v1">
                      <h4 class="-tx-v2">Gestión de us</h4>
                    </div>
                    <div class="-e-v1">
                      <i class="material-icons -e-v3">arrow_forward_ios</i>
                    </div>
                  </div></a>
                </div>
                <br>
              </div>
              <br>
            </div>
            <!-- Contenedor Inferior (Barra navegación) -->
              @include('partials.accesoRapido')
    @elseif($usuario_rol == 'Empleado')
    <h1></h1>
    @endif



    <!-- ✅ archivo JS Propio-->
    <script src="{{ asset( 'js/ScriptObjetos.js' ) }}"></script>
    <!-- Archivo JS Bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>