from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CrearPedidoDesdeCarritoView, PedidoViewSet, PedidoDetalleViewSet, PedidosUsuarioView, PedidosEmpleadoView, PedidosAdminView, ActualizarEstadoPedidoView

router = DefaultRouter()
router.register(r"pedidos", PedidoViewSet, basename="pedidos")
router.register(r"pedidos/detalles", PedidoDetalleViewSet, basename="pedidos_detalles")


urlpatterns = [
    path("", include(router.urls)),
    path("crear-desde-carrito/", CrearPedidoDesdeCarritoView.as_view()),

    path("usuario/", PedidosUsuarioView.as_view()),
    path("empleado/", PedidosEmpleadoView.as_view()),
    path("admin/", PedidosAdminView.as_view()),
    path("pedido/<int:pk>/actualizar/", ActualizarEstadoPedidoView.as_view())
]