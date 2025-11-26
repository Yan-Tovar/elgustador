# usuarios/auth_urls.py
from django.urls import path
from .views import UsuarioRegistroViewSet, LoginViewSet
from .views_changepassword import RequestPasswordResetView, ResetPasswordConfirmView

registro = UsuarioRegistroViewSet.as_view({"post": "create"})
login = LoginViewSet.as_view({"post": "create"})

urlpatterns = [
    path("register/", registro, name="usuario-register"),
    path("login/", login, name="usuario-login"),
    path("password-reset/", RequestPasswordResetView.as_view(), name="password-reset"),
    path("password-reset-confirm/", ResetPasswordConfirmView.as_view(), name="password-reset-confirm"),
]