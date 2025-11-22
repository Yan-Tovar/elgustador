# pedidos/serializers.py
from rest_framework import serializers
from .models import Pedido, PedidoDetalle
from usuarios.serializers import UsuarioSerializer
from municipios.serializers import MunicipioSerializer
from departamentos.serializers import DepartamentoSerializer
from productos.serializers import ProductoSerializer

class PedidoDetalleSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = PedidoDetalle
        fields = '__all__'

class PedidoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    municipio = MunicipioSerializer(read_only=True)
    departamento = DepartamentoSerializer(read_only=True)
    detalles = PedidoDetalleSerializer(many=True, source='pedidos_detalles', read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'

class PedidoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'total', 'estado', 'fecha_creacion']