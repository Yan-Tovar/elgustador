# usuarios/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, UsuarioRegistroViewSet, LoginViewSet, UsuarioSelfViewSet
from .views_logout import LogoutView

router = DefaultRouter()
router.register(r"", UsuarioViewSet, basename="usuarios")
router.register(r"registro", UsuarioRegistroViewSet, basename="usuarios-registro")
router.register(r"login", LoginViewSet, basename="usuarios-login")
router.register(r"usuarios/me", UsuarioSelfViewSet, basename="usuarios-me")  

urlpatterns = [
    path("", include(router.urls)),
    path("usuarios/logout/", LogoutView.as_view(), name="logout"),
]
