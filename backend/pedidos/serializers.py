from rest_framework import serializers
from .models import Pedido
from pedidos_detalles.models import PedidoDetalle
from usuarios.serializers import UsuarioSerializer
from municipios.serializers import MunicipioSerializer
from departamentos.serializers import DepartamentoSerializer
from productos.serializers import ProductoSerializer

class PedidoDetalleSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = PedidoDetalle
        fields = ['id', 'producto', 'cantidad', 'precio_unitario', 'precio_total']


class PedidoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    municipio = MunicipioSerializer(read_only=True)
    departamento = DepartamentoSerializer(read_only=True)
    detalles = PedidoDetalleSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'

        # Campos que NO deben actualizarse
        read_only_fields = [
            'id',
            'usuario',
            'municipio',
            'departamento',
            'subtotal',
            'costo_envio',
            'total',
            'metodo_pago',
            'fecha_creacion',
        ]

        # Permitir actualizar solo el estado
        extra_kwargs = {
            'estado': {'required': False},
        }

class PedidoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'usuario', 'total', 'estado', 'fecha_creacion']

class PedidoEstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'estado']
