# pagos/serializers.py
from rest_framework import serializers
from .models import Pago
from pedidos.models import Pedido
from pedidos.serializers import PedidoSerializer

class PagoSerializer(serializers.ModelSerializer):
    pedido = serializers.PrimaryKeyRelatedField(queryset=Pedido.objects.all())
    class Meta:
        model = Pago
        fields = ["id", "pedido", "pasarela", "monto", "estado", "transaccion_id", "fecha"]
        read_only_fields = ["id", "fecha"]
