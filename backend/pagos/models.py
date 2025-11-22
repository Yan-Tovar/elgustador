from django.db import models
from pedidos.models import Pedido

class Pago(models.Model):
    id = models.BigAutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    pasarela = models.CharField(max_length=50)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    estado = models.CharField(max_length=50)
    transaccion_id = models.CharField(max_length=255, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
