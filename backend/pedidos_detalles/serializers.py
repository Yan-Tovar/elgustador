# pedidos_detalles/serializers.py
from rest_framework import serializers
from .models import PedidoDetalle
from productos.serializers import ProductoSerializer

class PedidoDetalleSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = PedidoDetalle
        fields = '__all__'