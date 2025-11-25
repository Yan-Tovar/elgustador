# facturas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FacturaViewSet,
    FacturasUsuarioView,
    FacturasAdminView
)

router = DefaultRouter()
router.register(r"", FacturaViewSet, basename="facturas")

urlpatterns = [
    path("", include(router.urls)),
    path("facturas/usuario/", FacturasUsuarioView.as_view(), name="facturas_usuario"),
    path("facturas/admin/", FacturasAdminView.as_view(), name="facturas_admin"),
]
