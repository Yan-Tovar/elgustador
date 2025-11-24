from django.db import models
from productos.models import Producto
from pedidos.models import Pedido

class PedidoDetalle(models.Model):
    id = models.BigAutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name="pedidos_detalles")

    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    precio_total = models.DecimalField(max_digits=12, decimal_places=2)
