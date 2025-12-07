# usuarios_actividades/serializers.py
from rest_framework import serializers
from .models import UsuarioActividad
from usuarios.serializers import UsuarioSerializer

class UsuarioActividadSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = UsuarioActividad
        fields = '__all__'