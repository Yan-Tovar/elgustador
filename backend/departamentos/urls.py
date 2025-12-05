# departamentos/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartamentoViewSet, buscar_departamento

router = DefaultRouter()
router.register(r"", DepartamentoViewSet, basename="departamentos")

urlpatterns = [
    path("", include(router.urls)),
    path("departamentos/buscar/", buscar_departamento, name="buscar_departamento"),
]    