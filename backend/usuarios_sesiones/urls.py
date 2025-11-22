from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioSesionViewSet

router = DefaultRouter()
router.register(r"", UsuarioSesionViewSet, basename="usuarios-sesiones")

urlpatterns = [
    path("", include(router.urls)),
]