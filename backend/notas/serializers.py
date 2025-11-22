# notas/serializers.py
from rest_framework import serializers
from .models import Notas
from usuarios.serializers import UsuarioSerializer
from productos.serializers import ProductoSerializer

class NotaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = Notas
        fields = '__all__'