# usuarios_sesiones/serializers.py
from rest_framework import serializers
from .models import UsuariosSesiones
from usuarios.serializers import UsuarioSerializer

class UsuarioSesionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = UsuariosSesiones
        fields = '__all__'