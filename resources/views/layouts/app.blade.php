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

    <!-- Tu CSS personalizado -->
    <link rel="stylesheet" href="{{ asset('css/EstiloObjetos.css') }}">
</head>
<body>

    <!-- Barra de Navegación -->
        @include('partials.barraNavegacion')

    <!-- Aquí se cargará el contenido -->
        @yield('content')

    <!-- Contenedor Inferior (Barra navegación) -->
        @include('partials.accesoRapido')

    <!-- archivo JS Propio-->
        <script src="{{  asset('js/ScriptObjetos.js') }}"></script>

    <!-- Archivo JS Bootstrap -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>