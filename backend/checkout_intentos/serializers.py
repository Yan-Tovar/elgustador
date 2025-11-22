# checkout_intentos/serializers.py
from rest_framework import serializers
from .models import CheckoutIntento
from usuarios.serializers import UsuarioSerializer
from pedidos.serializers import PedidoSerializer

class CheckoutIntentosSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    pedido = PedidoSerializer(read_only=True)
    class Meta:
        model = CheckoutIntento
        fields = '__all__'