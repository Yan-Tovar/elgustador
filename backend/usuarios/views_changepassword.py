from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth import get_user_model

# Importar las funciones correctas
from .tokens import generate_reset_token, validate_reset_token

from .models import Usuario


# ====================================================================================
#                       SOLICITAR REESTABLECIMIENTO DE CONTRASEÑA
# ====================================================================================
class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"detail": "Debes enviar un correo"}, status=400)

        try:
            # Buscar si existe un usuario con este correo
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            # Por seguridad devolvemos el mismo mensaje aunque no exista el correo
            return Response({"detail": "Se ha enviado un enlace al correo."}, status=200)

        # UID del usuario
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Token firmado
        token = generate_reset_token(user)

        # URL que recibirá el frontend
        reset_url = f"{settings.FRONTEND_URL}/auth/reset-password/{uid}/{token}"

        # Configuración del email
        subject = "Restablecimiento de contraseña - El Gustador"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user.email]

        # Email HTML profesional
        html_content = f"""
        <div style="font-family: Arial; color:#1F2B5B;">
            <h2 style="color:#1EBE4E;">Solicitud de cambio de contraseña</h2>
            <p>Hola <b>{user.nombre}</b>,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p style="margin:25px 0;">
                <a href="{reset_url}"
                   style="background:#FF6A00; padding:14px 20px;
                          color:white; text-decoration:none; border-radius:6px;
                          font-weight:bold;">
                    Cambiar mi contraseña
                </a>
            </p>
            <p>Si tú no realizaste esta solicitud, puedes ignorar este correo.</p>
            <br>
            <hr style="border:0; height:2px; background:#1EBE4E;">
            <p style="font-size:12px; color:#555; text-align:center;">
                © {timezone.now().year} El Gustador · Ibagué - Tolima<br>
                Este es un mensaje automático, por favor no responder.
            </p>
        </div>
        """

        email_message = EmailMultiAlternatives(subject, "", from_email, to)
        email_message.attach_alternative(html_content, "text/html")
        email_message.send()

        return Response({"detail": "Se ha enviado un enlace al correo."}, status=200)



# ====================================================================================
#                           CONFIRMAR CAMBIO DE CONTRASEÑA
# ====================================================================================
class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")
        password2 = request.data.get("password2")

        # Validación básica
        if not all([uid, token, password, password2]):
            return Response({"detail": "Datos incompletos"}, status=400)

        if password != password2:
            return Response({"detail": "Las contraseñas no coinciden"}, status=400)

        # Decodificar usuario encontrado en UID
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = Usuario.objects.get(pk=user_id)
        except:
            return Response({"detail": "Enlace inválido"}, status=400)

        # Validar token
        is_valid, message = validate_reset_token(token)
        if not is_valid:
            return Response({"detail": message}, status=400)

        # TODO: Se podría verificar si el token corresponde al usuario según tu tabla ResetToken
        # Pero NO se debe regenerar un token nuevo para comparar

        # Cambiar contraseña
        user.set_password(password)
        user.save()

        return Response({"detail": "Contraseña actualizada correctamente"}, status=200)
