# usuarios_sesiones/serializers.py
from rest_framework import serializers
from .models import UsuarioSesion
from usuarios.serializers import UsuarioSerializer

class UsuarioSesionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = UsuarioSesion
        fields = '__all__'