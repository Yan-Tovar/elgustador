from rest_framework import serializers
from .models import Carrito, CarritoItem
from productos.serializers import ProductoSerializer


class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = CarritoItem
        fields = "__all__"


class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Carrito
        fields = ["id", "usuario", "items", "total", "creado", "actualizado"]
