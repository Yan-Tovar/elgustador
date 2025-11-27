# usuarios/auth_urls.py
from django.urls import path
from .views import UsuarioRegistroViewSet, LoginViewSet
from .views_changepassword import RequestPasswordResetView, ResetPasswordConfirmView
from .views_email_verification import EmailSendCodeView, EmailVerifyCodeView

registro = UsuarioRegistroViewSet.as_view({"post": "create"})
login = LoginViewSet.as_view({"post": "create"})
send_email_code = EmailSendCodeView.as_view()
verify_email_code = EmailVerifyCodeView.as_view()

urlpatterns = [
    path("register/", registro, name="usuario-register"),
    path("login/", login, name="usuario-login"),
    path("password-reset/", RequestPasswordResetView.as_view(), name="password-reset"),
    path("password-reset-confirm/", ResetPasswordConfirmView.as_view(), name="password-reset-confirm"),
    path("email/send-code/", send_email_code, name="email-send-code"),
    path("email/verify-code/", verify_email_code, name="email-verify-code"),
]