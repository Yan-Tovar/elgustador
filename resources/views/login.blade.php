<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

    <!-- Google Icons (Material Icons) -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Bootstrap CSS (v5.3.2) desde CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- CSS personalizado -->
    <link rel="stylesheet" href="{{ asset('css/EstiloObjetos.css') }}">
</head>
<body class="-bd-v2"> 
    <div class="container">
        <div class="row">
            <div class="col">
                <br>
                <div class="-c-v4"><h1 class="-tx-v1">EL GUSTADOR</h1></div>
                <br>
                <div class="-c-v4"><h4 class="-tx-v2">Ingrese su Cuenta</h4></div>
            </div>
            @if(session('error'))
                <p style="color:red;">{{ session('error') }}</p>
            @endif
        </div>
        <div class="row">
            <div class="col">
                <form method="POST" action="{{ route('login.procesar') }}" class="-c-v1">
                    @csrf
                    <input class="-b-v2" type="email" name="email" placeholder="Correo Electrónico" required><br>
                    <br>
                    <input class="-b-v2" type="password" name="password" placeholder="Contraseña" required><br>
                    <br>
                    <a href="#"><h6 class="-tx-v4">¿Olvidaste tu contraseña?</p></h6></a>
                    <button type="submit" class="-b-v1">Iniciar Sesión</button>
                </form>
            </div>
        </div>
        <br>
        <br>
        <div class="row">
            <div class="col">
                <div class="-c-v4"><p class="-tx-v2">¿Aún no has creado una cuenta?<br><a href="General_Registro.html">Registrate,</a> es gratis!</p></div>
            </div>
        </div>
        <br>
        <!-- Notificación de Ayuda -->
        <div class="-c-v4">
            <p class="-tx-v4" onclick="NotificacionAyuda()">Ayuda</p><i class="material-icons">info</i>
            <div id="notificaciones-container"></div>
            <audio id="notificacion-sonido" src="Imagenes/notification-tone-swift-gesture.ogg" preload="auto"></audio>
          </div>
    </div>
    <!-- Tu archivo JS personalizado -->
    <script src="{{ asset('js/ScriptObjetos.js') }}"></script>
</body>
</html>