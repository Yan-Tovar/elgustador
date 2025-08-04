<!-- Contenedor superior (barra navegación) -->
<div class="-c-v2">
    <div class="-c-v4-v1">
    <a href="{{ route('opcionesUsuario') }}"><i class="material-icons md-48 ">menu</i></a> 
    </div>
    <div class="-c-v4-v2">
        <h5 class="-tx-v3">{{ Session::get('usuario_nombre') }}</h5>
        <a href="General_Buscar.html">
        <div>
            <form role="search" id="barrabusqueda">
                <input class="-b-v2-v1" type="search" placeholder="Buscar" aria-label="Search">
            </form>
        </div>
        </a>
    </div>
</div>
<!-- Este div y clase evita que el contendio inicial se quede debajo del contendor -c-v2 -->
<div class="-c-v7"></div>