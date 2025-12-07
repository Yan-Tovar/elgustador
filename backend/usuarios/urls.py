# usuarios/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    UsuarioRegistroViewSet,
    LoginViewSet,
)
from .views_logout import LogoutView
from .views_me import UsuarioMeAPIView

router = DefaultRouter()
router.register(r"", UsuarioViewSet, basename="usuarios")
router.register(r"registro", UsuarioRegistroViewSet, basename="usuarios-registro")
router.register(r"login", LoginViewSet, basename="usuarios-login")

urlpatterns = [
    path("", include(router.urls)),

    # Vista independiente del usuario autenticado
    path("usuarios/me/", UsuarioMeAPIView.as_view(), name="usuario-me"),

    # Logout separado
    path("logout/", LogoutView.as_view(), name="logout"),
]
