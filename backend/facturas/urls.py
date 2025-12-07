# facturas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FacturaViewSet,
    FacturasUsuarioView,
    FacturasAdminView,
    DescargarFacturaPDF,
    EnviarFacturaEmail,
    FacturasAdminSearchView,
    FacturasAdminExportExcel
)

router = DefaultRouter()
router.register(r"", FacturaViewSet, basename="facturas")

urlpatterns = [
    path("", include(router.urls)),

    # Listado de usuario
    path("facturas/usuario/", FacturasUsuarioView.as_view(), name="facturas_usuario"),

    # Listado admin (el paginado y filtros normales)
    path("facturas/admin/", FacturasAdminView.as_view(), name="facturas_admin"),

    # -------------------------------
    # NUEVAS RUTAS PARA ADMIN
    # -------------------------------

    # Buscador avanzado de facturas para admin
    path("facturas/admin/search/", FacturasAdminSearchView.as_view(), name="facturas_admin_search"),

    # Exportar reporte a Excel
    path("facturas/admin/export-excel/", FacturasAdminExportExcel.as_view(), name="facturas_admin_export"),

    # -------------------------------
    # PDF y email
    # -------------------------------
    path("<int:factura_id>/descargar/", DescargarFacturaPDF.as_view(), name="descargar_factura"),
    path("<int:factura_id>/enviar-email/", EnviarFacturaEmail.as_view(), name="enviar_factura_email"),
]
