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
  <!-- Encabezado Barra de navegacion -->
    <div class="row">
      <div class="col-4">
        <div class="-c-v4">
          @if($usuario_foto)
              <img src="{{ asset('storage/imagenes/' . Session::get('usuario_foto')) }}" class="-im-v2">
          @else
              <img src="{{ asset('imagenes/perfil_oculto.png') }}" class="-im-v2">
          @endif
        </div>
      </div>
      <div class="col-4">
        <div class="-c-v4-v3">
          <div class="-c-v4">
            <h4 class="-tx-v2-v1">{{ Session::get('usuario_nombre') }}</h4>
          </div>
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
          <div class="-c-v4"><a href="{{ route('ajustesUsuario.show') }}"><i class="material-icons md-50">settings</i></a> </div>
        </div>
      </div>
    </div>
    <!-- Final del Contenedor -->
    <div class="row">
      <!-- Contenedor Información Usuario-->
      <div class="col-sm-12 col-md-12 col-lg-4">
          <br>
          <div class="-c-v1">
            <h5>Nombre</h5>
            <h1>{{ Session::get('usuario_nombre') }}</h1>
            <div class="-c-v4">
              <h5>Identificación: </h5>
              <h5>{{ Session::get('usuario_identificacion') }}</h5>
            </div>
            <div class="-c-v4">
              <h5>Correo: </h5>
              <h5>{{ Session::get('usuario_email') }}</h5>
            </div>
            <div class="-c-v4">
              <h5>Dirección: </h5>
              <h5>{{ Session::get('usuario_direccion') }}</h5>
            </div>
          </div>
      </div>
      <!-- Fin Contenedor Informacion Usuario -->
    @if($usuario_rol == 'Administrador')
      <!-- Botones de acceso Rápido cuadrados -->
      <div class="col-sm-12 col-md-12 col-lg-4">
        <div class="-c-v8">
          <br>
          <!-- Boton -->
          <a href="{{ route('productos.index') }}">
            <div class="-c-v5">
              <div>
                <img src="{{ asset('imagenes/gestionProductos.jpeg') }}" alt="Gestion de Productos">
              </div>
              <div>
                <p>Productos</p>
              </div>
            </div>
          </a>
          <!-- FinBoton -->
          <!-- Boton -->
          <a href="Cliente_Categoria.html">
            <div class="-c-v5">
              <div>
                <img src="Imagenes/Producto1.png" alt="">
              </div>
              <div>
                <p>Categoria1</p>
              </div>
            </div>
          </a>
          <!-- FinBoton -->
          <!-- Boton -->
          <a href="Cliente_Categoria.html">
            <div class="-c-v5">
              <div>
                <img src="Imagenes/Producto1.png" alt="">
              </div>
              <div>
                <p>Categoria1</p>
              </div>
            </div>
          </a>
          <!-- FinBoton -->
        </div>
      </div>
      <br>
      <!-- Botones de acceso rapido Naranjados -->
        <!-- Boton -->
        <div class="col-sm-12 col-md-12 col-lg-4">
          <br>
          <a href="Administrador_GestionUsuario_General.html">
            <div class="-c-v3-v1">
              <div class="-e-v1">
                <i class="material-icons -e-v3">person</i>
              </div>
              <div class="-e-v1">
                <h4 class="-tx-v2">Gestión de us</h4>
              </div>
              <div class="-e-v1">
                <i class="material-icons -e-v3">arrow_forward_ios</i>
              </div>
            </div>
          </a>
        </div>
        <!-- FinBoton -->
        <!-- Boton -->
        <div class="col-sm-12 col-md-12 col-lg-4">
          <br>
          <a href="Administrador_GestionUsuario_General.html">
            <div class="-c-v3-v1">
              <div class="-e-v1">
                <i class="material-icons -e-v3">person</i>
              </div>
              <div class="-e-v1">
                <h4 class="-tx-v2">Gestión de us</h4>
              </div>
              <div class="-e-v1">
                <i class="material-icons -e-v3">arrow_forward_ios</i>
              </div>
            </div>
          </a>
        </div>
        <!-- FinBoton -->
        <!-- Boton -->
        <div class="col-sm-12 col-md-12 col-lg-4">
          <br>
          <a href="Administrador_GestionUsuario_General.html">
            <div class="-c-v3-v1">
              <div class="-e-v1">
                <i class="material-icons -e-v3">person</i>
              </div>
              <div class="-e-v1">
                <h4 class="-tx-v2">Gestión de us</h4>
              </div>
              <div class="-e-v1">
                <i class="material-icons -e-v3">arrow_forward_ios</i>
              </div>
            </div>
          </a>
        </div>
        <!-- FinBoton -->
        <br>   
    @elseif($usuario_rol == 'Empleado')
    
    @endif

    </div>

    <!-- Contenedor Inferior (Barra navegación) -->
      @include('partials.accesoRapido')
    <!-- ✅ archivo JS Propio-->
    <script src="{{ asset( 'js/ScriptObjetos.js' ) }}"></script>
    <!-- Archivo JS Bootstrap -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>