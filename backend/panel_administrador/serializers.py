# panel_administrador/serializers.py
from rest_framework import serializers

class DashboardSerializer(serializers.Serializer):
    total_usuarios = serializers.IntegerField()
    total_productos = serializers.IntegerField()
    total_pedidos = serializers.IntegerField()
    total_ingresos = serializers.DecimalField(max_digits=12, decimal_places=2)
    # campos adicionales según necesidades del dashboard