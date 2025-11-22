from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioActividadViewSet

router = DefaultRouter()
router.register(r"", UsuarioActividadViewSet, basename="usuarios-actividades")

urlpatterns = [
    path("", include(router.urls)),
]