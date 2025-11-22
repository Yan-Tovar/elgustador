from django.db import models
from departamentos.models import Departamento

class Municipio(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE)
    costo_envio = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} - {self.departamento.nombre}"
