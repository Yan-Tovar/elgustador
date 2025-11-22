# facturas/serializers.py
from rest_framework import serializers
from .models import Factura
from pedidos.serializers import PedidoSerializer

class FacturaSerializer(serializers.ModelSerializer):
    pedido = PedidoSerializer(read_only=True)
    class Meta:
        model = Factura
        fields = '__all__'