# usuarios/auth_urls.py
from django.urls import path
from .views import UsuarioRegistroViewSet, LoginViewSet

registro = UsuarioRegistroViewSet.as_view({"post": "create"})
login = LoginViewSet.as_view({"post": "create"})

urlpatterns = [
    path("register/", registro, name="usuario-register"),
    path("login/", login, name="usuario-login"),
]