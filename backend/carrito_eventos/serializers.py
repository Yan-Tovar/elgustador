from rest_framework import serializers
from .models import CarritoEvento

class CarritoEventoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    class Meta:
        model = CarritoEvento
        fields = "__all__"
