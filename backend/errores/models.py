from django.db import models
from django.conf import settings

class ErrorRegistro(models.Model):
    """
    Registro centralizado de errores/excepciones del backend.
    No sustituye Sentry, pero permite consultar fallos en BD.
    """
    SEVERIDADES = (
        ("debug", "Debug"),
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
        ("critical", "Critical"),
    )

    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    nivel = models.CharField(max_length=20, choices=SEVERIDADES, default="error")
    mensaje = models.TextField()
    detalle = models.TextField(null=True, blank=True)  # stacktrace o detalles ampliados
    endpoint = models.CharField(max_length=255, null=True, blank=True)
    metodo_http = models.CharField(max_length=10, null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    resuelto = models.BooleanField(default=False)
    resuelto_en = models.DateTimeField(null=True, blank=True)
    ticket_incidencia = models.CharField(max_length=200, null=True, blank=True, help_text="ID en tracker externo (opcional)")

    class Meta:
        verbose_name = "Registro de Error"
        verbose_name_plural = "Registros de Errores"
        ordering = ["-creado_en"]
        indexes = [
            models.Index(fields=['nivel']),
            models.Index(fields=['creado_en']),
        ]

    def __str__(self):
        return f"[{self.nivel}] {self.mensaje[:80]}"
