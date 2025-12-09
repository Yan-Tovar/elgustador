# usuarios/urls_exports.py
from django.urls import path
from .views_export import ExportModelExcelView

urlpatterns = [
    # Endpoint genérico para exportar cualquier tabla de la base de datos a Excel
    # Se pasa como query params: ?app=<nombre_app>&model=<nombre_modelo>
    path("exportar/", ExportModelExcelView.as_view(), name="export-model-excel"),
]
