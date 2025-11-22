# pqrs/serializers.py
from rest_framework import serializers
from .models import Pqrs
from usuarios.serializers import UsuarioSerializer

class PqrsSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    class Meta:
        model = Pqrs
        fields = '__all__'