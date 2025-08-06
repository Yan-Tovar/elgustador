@if($usuario_rol == 'Administrador')
    <div class="-c-v2-v1">
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">home</i></a> 
        <a href="{{ route('opcionesUsuario') }}"><i class="material-icons -e-v3">person</i></a> 
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">description</i></a> 
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">comment</i></a>  
    </div>
@elseif($usuario_rol == 'Empleado')
    <div class="-c-v2-v1">
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">home</i></a> 
        <a href="{{ route('opcionesUsuario') }}"><i class="material-icons -e-v3">person</i></a> 
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">description</i></a> 
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">comment</i></a>  
    </div> 
@elseif($usuario_rol == 'Cliente')
    <div class="-c-v2-v1">
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">home</i></a> 
        <a href="{{ route('opcionesUsuario') }}"><i class="material-icons -e-v3">person</i></a> 
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">description</i></a> 
        <a href="{{ route('dashboard') }}"><i class="material-icons -e-v3">comment</i></a>  
    </div>
@endif
