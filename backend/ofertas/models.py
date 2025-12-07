from django.db import models
from productos.models import Producto
from usuarios.models import Usuario

class Oferta(models.Model):
    id = models.BigAutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(null=True, blank=True)

    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    descuento_valor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()

    estado = models.BooleanField(default=True)

    creado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.nombre
