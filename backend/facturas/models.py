from django.db import models
from pedidos.models import Pedido

class Factura(models.Model):
    id = models.BigAutoField(primary_key=True)
    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE)

    numero_factura = models.CharField(max_length=100, unique=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    impuestos = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    url_pdf = models.CharField(max_length=255)
    fecha = models.DateTimeField(auto_now_add=True)
