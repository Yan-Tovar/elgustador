from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Notificacion
from django.utils import timezone

def crear_notificacion(usuario, titulo, mensaje, enviar_email=False):
    """
    Crea una notificación interna y opcionalmente envía correo con formato HTML bonito.
    """
    
    # -------------------------------
    # Crear notificación en base de datos
    # -------------------------------
    notificacion = Notificacion.objects.create(
        usuario=usuario,
        titulo=titulo,
        mensaje=mensaje
    )

    # -------------------------------
    # Enviar correo HTML bonito si se requiere
    # -------------------------------
    if enviar_email and usuario.email:
        subject = titulo
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [usuario.email]

        # Contenido HTML
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px; color: #333;">
            <!-- Encabezado -->
            <div style="background-color: #ff4500; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin:0;">{titulo}</h2>
            </div>

            <!-- Cuerpo -->
            <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: -4px;">
                <p style="font-size: 16px; line-height: 1.5;">
                    {mensaje}
                </p>
            </div>

            <!-- Pie de página -->
            <div style="text-align: center; font-size: 12px; color: #888; margin-top: 10px;">
                © {timezone.now().year} El Gustador. Todos los derechos reservados.
            </div>
        </body>
        </html>
        """

        # Crear mensaje HTML
        email = EmailMultiAlternatives(subject=subject, body=mensaje, from_email=from_email, to=to_email)
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=True)

    return notificacion
