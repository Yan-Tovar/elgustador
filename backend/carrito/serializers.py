# carrito/serializers.py
from rest_framework import serializers
from .models import Carrito
from carrito_eventos.models import CarritoEvento
from usuarios.serializers import UsuarioSerializer
from productos.serializers import ProductoSerializer

class CarritoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = Carrito
        fields = '__all__'

class CarritoEventSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = CarritoEvento
        fields = '__all__'