# productos_vistos/serializers.py
from rest_framework import serializers
from .models import ProductosVistos
from usuarios.serializers import UsuarioSerializer
from productos.serializers import ProductoSerializer

class ProductosVistosSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = ProductosVistos
        fields = '__all__'