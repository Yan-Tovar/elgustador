from django.db import models

class ReporteAnalisis(models.Model):
    """
    Almacena reportes/ KPIs / snapshots periódicos.
    'tipo' puede ser: ventas_diarias, usuarios_cohorte, productos_mas_vistos, etc.
    'datos' guarda el payload (json) con métricas agregadas.
    """
    id = models.BigAutoField(primary_key=True)
    tipo = models.CharField(max_length=150)
    descripcion = models.TextField(null=True, blank=True)
    datos = models.JSONField(default=dict)  # estructura libre: {'total_ventas': 100, 'ingresos': 1234.5}
    periodo_inicio = models.DateTimeField(null=True, blank=True)
    periodo_fin = models.DateTimeField(null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    generado_por = models.CharField(max_length=150, null=True, blank=True)  # ej: 'cron', 'manual', 'job-worker'

    class Meta:
        verbose_name = "Reporte de Análisis"
        verbose_name_plural = "Reportes de Análisis"
        ordering = ["-creado_en"]

    def __str__(self):
        return f"{self.tipo} - {self.creado_en:%Y-%m-%d %H:%M}"
