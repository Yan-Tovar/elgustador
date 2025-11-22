# pagos/serializers.py
from rest_framework import serializers
from .models import Pago
from pedidos.serializers import PedidoSerializer

class PagoSerializer(serializers.ModelSerializer):
    pedido = PedidoSerializer(read_only=True)
    class Meta:
        model = Pago
        fields = '__all__'