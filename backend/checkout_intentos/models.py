from django.db import models
from django.conf import settings

class CheckoutIntento(models.Model):
    """
    Registro de intentos de checkout / pago.
    Useful to troubleshoot payment failures, abandoned checkouts, fraud detection.
    """
    ESTADOS = (
        ("started", "Iniciado"),
        ("processing", "En proceso"),
        ("failed", "Fallido"),
        ("succeeded", "Exitoso"),
        ("cancelled", "Cancelado"),
    )

    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    pedido_id = models.BigIntegerField(null=True, blank=True, help_text="ID del pedido relacionado (si existe)")
    metodo_pago = models.CharField(max_length=100, null=True, blank=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estado = models.CharField(max_length=30, choices=ESTADOS, default="started")
    error_mensaje = models.TextField(null=True, blank=True)
    provider_response = models.JSONField(null=True, blank=True, help_text="Respuesta raw de la pasarela (paypal/stripe)")
    session_data = models.JSONField(null=True, blank=True, help_text="Datos del proceso (carrito snapshot, metadata)")
    ip = models.CharField(max_length=50, null=True, blank=True)
    user_agent = models.CharField(max_length=300, null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Intento de Checkout"
        verbose_name_plural = "Intentos de Checkout"
        indexes = [
            models.Index(fields=['usuario']),
            models.Index(fields=['estado']),
            models.Index(fields=['creado_en']),
        ]

    def __str__(self):
        return f"Intento #{self.id} - {self.estado} - {self.monto or 'N/A'}"
