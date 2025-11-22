from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, UsuarioRegistroViewSet, LoginViewSet
from .views_logout import LogoutView

router = DefaultRouter()
router.register(r"", UsuarioViewSet, basename="usuarios")
router.register(r"registro", UsuarioRegistroViewSet, basename="usuarios-registro")
router.register(r"login", LoginViewSet, basename="usuarios-login")

urlpatterns = [
    path("", include(router.urls)),
]