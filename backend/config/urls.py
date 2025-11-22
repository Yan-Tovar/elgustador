"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # API agrupada por apps
    path("api/usuarios/", include("usuarios.urls")),
    path("api/auth/", include("usuarios.auth_urls")),  
    path("api/usuarios-sesiones/", include("usuarios_sesiones.urls")),
    path("api/usuarios-actividades/", include("usuarios_actividades.urls")),
    path("api/usuarios-ingresos/", include("usuarios_ingresos.urls")),

    path("api/productos/", include("productos.urls")),
    path("api/categorias/", include("categorias.urls")),
    path("api/ofertas/", include("ofertas.urls")),
    path("api/productos-vistos/", include("productos_vistos.urls")),

    path("api/departamentos/", include("departamentos.urls")),
    path("api/municipios/", include("municipios.urls")),
    path("api/panel-administrador/", include("panel_administrador.urls")),

    path("api/carrusel/", include("carrusel.urls")),

    path("api/carrito/", include("carrito.urls")),
    path("api/carrito-eventos/", include("carrito_eventos.urls")),
    
    path("api/checkout-intentos/", include("checkout_intentos.urls")),

    path("api/pedidos/", include("pedidos.urls")),
    path("api/pedidos-detalles/", include("pedidos_detalles.urls")),

    path("api/pagos/", include("pagos.urls")),
    path("api/facturas/", include("facturas.urls")),

    path("api/notificaciones/", include("notificaciones.urls")),
    path("api/notas/", include("notas.urls")),
    path("api/pqrs/", include("pqrs.urls")),

    path("api/analisis/", include("analisis.urls")),
    path("api/errores/", include("errores.urls")),
]

