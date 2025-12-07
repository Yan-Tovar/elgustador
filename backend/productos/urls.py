from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    ProductosPorCategoriaView,
    InventarioEstadisticasView,
    InventarioReportesView
)

router = DefaultRouter()
router.register(r"gestion", ProductoViewSet, basename="productos")

urlpatterns = [
    path("", include(router.urls)),

    # Endpoints personalizados de estadisticas / reportes
    path("estadisticas/", InventarioEstadisticasView.as_view(), name="inventario-estadisticas"),
    path("reportes/", InventarioReportesView.as_view(), name="inventario-reportes"),

    # Filtro por categoría
    path("por-categoria/<int:categoria_id>/", ProductosPorCategoriaView.as_view(), name="productos-por-categoria"),
]
