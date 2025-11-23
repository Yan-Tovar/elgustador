# notas/serializers.py
from rest_framework import serializers
from .models import Nota

class NotaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = ["id", "titulo", "contenido", "fecha_creacion", "estado"]


class NotaCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = [ "titulo", "contenido"]

class NotaSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Nota
        fields = '__all__'