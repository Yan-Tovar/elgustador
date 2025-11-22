# carrito_eventos/serializers.py
from rest_framework import serializers
from .models import CarritoEvento
from usuarios.serializers import UsuarioSerializer
from productos.serializers import ProductoSerializer

class CarritoEventoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    producto = ProductoSerializer(read_only=True)

    class Meta:
        model = CarritoEvento
        fields = ['id', 'usuario', 'producto', 'accion', 'cantidad', 'fecha']