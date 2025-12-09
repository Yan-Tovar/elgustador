# pqrs/serializers.py
from rest_framework import serializers
from .models import PQRS
from usuarios.serializers import UsuarioSerializer

class PqrsSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = PQRS
        fields = '__all__'

class PQRSUpdateEstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PQRS
        fields = ['estado']  