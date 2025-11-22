from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioIngresoViewSet

router = DefaultRouter()
router.register(r"", UsuarioIngresoViewSet, basename="usuarios-ingresos")

urlpatterns = [
    path("", include(router.urls)),
]