# facturas/serializers.py
from rest_framework import serializers
from .models import Factura

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = ["id", "pedido", "numero_factura", "subtotal", "impuestos", "total", "url_pdf", "fecha"]
        read_only_fields = ["id", "numero_factura", "url_pdf", "fecha"]