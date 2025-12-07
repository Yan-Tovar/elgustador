from django.db import models
from django.conf import settings

class AdminAccion(models.Model):
    """
    Registro de acciones importantes hechas por administradores/empleados desde el panel.
    Ej: 'actualizó stock', 'cambió estado pedido', 'creó oferta', etc.
    """
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, help_text="Empleado/Admin que hizo la acción")
    accion = models.CharField(max_length=255)
    modelo_obj = models.CharField(max_length=150, null=True, blank=True, help_text="Nombre del modelo al que afectó")
    objeto_id = models.CharField(max_length=150, null=True, blank=True, help_text="ID del objeto afectado")
    detalle = models.JSONField(null=True, blank=True, help_text="Detalles estructurados de la acción")
    ip = models.CharField(max_length=50, null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Acción de Admin"
        verbose_name_plural = "Acciones de Admin"
        ordering = ["-creado_en"]
        indexes = [
            models.Index(fields=['usuario']),
            models.Index(fields=['modelo_obj']),
        ]

    def __str__(self):
        who = self.usuario.email if self.usuario else "Sistema"
        return f"{who} - {self.accion} - {self.creado_en:%Y-%m-%d %H:%M}"

class DashboardWidget(models.Model):
    """
    Opcional: configuración de widgets del dashboard (orden, tipo, configuración).
    """
    id = models.BigAutoField(primary_key=True)
    clave = models.CharField(max_length=100, unique=True)
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=100, help_text="grafico, tabla, kpi, etc.")
    config = models.JSONField(default=dict, blank=True)  # ej: {"periodo":"30d", "metric":"ventas"}
    orden = models.IntegerField(default=0)
    visible = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Widget del Dashboard"
        verbose_name_plural = "Widgets del Dashboard"
        ordering = ["orden"]

    def __str__(self):
        return self.titulo
