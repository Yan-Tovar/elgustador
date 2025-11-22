# notificaciones/serializers.py
from rest_framework import serializers
from .models import Notificacion
from usuarios.serializers import UsuarioSerializer

class NotificacionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = Notificacion
        fields = '__all__'