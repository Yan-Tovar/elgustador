# facturas/serializers.py
from rest_framework import serializers
from .models import Factura

class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = [
            "id",
            "pedido",
            "numero_factura",
            "subtotal",
            "impuestos",
            "total",
            "url_pdf",
            "fecha"
        ]
        read_only_fields = ["id", "numero_factura", "url_pdf", "fecha"]

    # Validación de subtotal > 0
    def validate_subtotal(self, value):
        if value <= 0:
            raise serializers.ValidationError("El subtotal debe ser mayor que cero.")
        return value

    # Validación de impuestos >= 0
    def validate_impuestos(self, value):
        if value < 0:
            raise serializers.ValidationError("Los impuestos no pueden ser negativos.")
        return value

    # Validación: total = subtotal + impuestos
    def validate(self, data):
        subtotal = data.get("subtotal")
        impuestos = data.get("impuestos")
        total = data.get("total")

        if subtotal is not None and impuestos is not None:
            esperado = subtotal + impuestos
            if total != esperado:
                raise serializers.ValidationError({
                    "total": f"El total debe ser igual a subtotal + impuestos ({esperado})."
                })

        return data
