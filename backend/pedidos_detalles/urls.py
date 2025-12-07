from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PedidoDetalleViewSet

router = DefaultRouter()
router.register(r"", PedidoDetalleViewSet, basename="pedidos-detalles")

urlpatterns = [
    path("", include(router.urls)),
]