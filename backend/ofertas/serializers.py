from rest_framework import serializers
from .models import Oferta
from productos.serializers import ProductoSerializer
from usuarios.serializers import UsuarioSerializer

class OfertaSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    creado_por = UsuarioSerializer(read_only=True)

    class Meta:
        model = Oferta
        fields = '__all__'


class OfertaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oferta
        fields = ['id', 'nombre', 'descuento_porcentaje', 'fecha_inicio', 'fecha_fin', 'estado']


class OfertaCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oferta
        fields = '__all__'
