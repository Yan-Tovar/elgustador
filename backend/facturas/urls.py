# facturas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FacturaViewSet,
    FacturasUsuarioView,
    FacturasAdminView,
    DescargarFacturaPDF,
    EnviarFacturaEmail
)

router = DefaultRouter()
router.register(r"", FacturaViewSet, basename="facturas")

urlpatterns = [
    path("", include(router.urls)),
    path("facturas/usuario/", FacturasUsuarioView.as_view(), name="facturas_usuario"),
    path("facturas/admin/", FacturasAdminView.as_view(), name="facturas_admin"),

    # nuevas rutas
    path("<int:factura_id>/descargar/", DescargarFacturaPDF.as_view(), name="descargar_factura"),
    path("<int:factura_id>/enviar-email/", EnviarFacturaEmail.as_view(), name="enviar_factura_email"),
]
