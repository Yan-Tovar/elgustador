# notas/serializers.py
from rest_framework import serializers
from .models import Nota
from usuarios.serializers import UsuarioSerializer
from productos.serializers import ProductoSerializer

class NotaSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    producto = ProductoSerializer(read_only=True)
    class Meta:
        model = Nota
        fields = '__all__'