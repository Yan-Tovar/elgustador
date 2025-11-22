# usuarios_ingresos/serializers.py
from rest_framework import serializers
from .models import UsuariosIngresos
from usuarios.serializers import UsuarioSerializer

class UsuarioIngresoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = UsuariosIngresos
        fields = '__all__'