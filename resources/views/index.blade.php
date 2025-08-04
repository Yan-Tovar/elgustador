<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>El Gustador</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">

    <!-- Google Icons (Material Icons) -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- Bootstrap CSS (v5.3.2) desde CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- CSS personalizado -->
    <link rel="stylesheet" href="{{ asset('css/EstiloObjetos.css') }}">
</head>
<body class="--c1"> 
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="-c-v4"><div><img src="Imagenes/Logo.png" class="-im-v1"></div></div>
                <div class="-c-v4">
                    <a href="{{ route('login') }}"><button type="button" class="-b-v1">Iniciar Sesion</button></a>
                </div>
                <br> <!-- Separación del boton iniciar sesión con el boton registro -->
                <div class="-c-v4">
                    <a href="#"><button type="button" class="-b-v1">Registrarse</button></a>
                </div>
            </div>
        </div>
    </div>
    <!-- ✅ Tu archivo JS personalizado -->
    <script src="js/ScriptObjetos.js"></script>
</body>
</html>