from django.db import models
from usuarios.models import Usuario
from departamentos.models import Departamento
from municipios.models import Municipio

class Pedido(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    municipio = models.ForeignKey(Municipio, on_delete=models.SET_NULL, null=True)
    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True)
    direccion_detallada = models.CharField(max_length=255)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    costo_envio = models.DecimalField(max_digits=12, decimal_places=2)
    metodo_pago = models.CharField(max_length=50)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    estado = models.CharField(max_length=50)

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
