from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.utils.crypto import get_random_string
from rest_framework.permissions import AllowAny
from .serializers import EmailVerificationSerializer
from .models import EmailVerification, Usuario
from django.conf import settings
from django.utils import timezone

class EmailSendCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # Verificar si el correo ya está registrado
        if Usuario.objects.filter(email=email).exists():
            return Response(
                {
                    "detail": "Este correo ya está registrado. Por favor usa otro correo.",
                    "status": "exists"
                },
                status=status.HTTP_200_OK  # <-- siempre OK, no se interpreta como error
            )

        # Generar código aleatorio de 6 dígitos
        code = get_random_string(length=6, allowed_chars='0123456789')

        # Guardar en DB
        EmailVerification.objects.create(email=email, code=code)

        # Construir email HTML profesional
        subject = "Código de verificación - El Gustador"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [email]

        html_content = f"""
        <div style="font-family: Arial; color:#1F2B5B;">
            <h2 style="color:#1EBE4E;">Código de verificación</h2>
            <p>Hola,</p>
            <p>Tu código de verificación para completar el registro es:</p>
            <h1 style="color:#FF6A00;">{code}</h1>
            <p>Este código expirará en 10 minutos.</p>

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

        return Response({"detail": "Código enviado al correo"}, status=status.HTTP_200_OK)


class EmailVerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data.get("code")

        try:
            record = EmailVerification.objects.filter(email=email, is_used=False).latest('created_at')
        except EmailVerification.DoesNotExist:
            return Response({"detail": "No se ha enviado código para este correo"}, status=status.HTTP_400_BAD_REQUEST)

        if record.is_expired():
            return Response({"detail": "El código ha expirado"}, status=status.HTTP_400_BAD_REQUEST)

        if record.code != code:
            return Response({"detail": "Código incorrecto"}, status=status.HTTP_400_BAD_REQUEST)

        # Marcar como usado
        record.is_used = True
        record.save()

        return Response({"detail": "Código verificado correctamente"}, status=status.HTTP_200_OK)
