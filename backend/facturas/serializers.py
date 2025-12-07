# facturas/serializers.py
from rest_framework import serializers
from .models import Factura

class FacturaSerializer(serializers.ModelSerializer):
    # Datos del usuario (ya existentes)
    usuario_nombre = serializers.CharField(source="pedido.usuario.nombre", read_only=True)
    usuario_email = serializers.CharField(source="pedido.usuario.email", read_only=True)
    usuario_identificacion = serializers.CharField(source="pedido.usuario.identificacion", read_only=True)

    # 🔥 Nuevos campos requeridos por las búsquedas y reportes
    pedido_id = serializers.IntegerField(source="pedido.id", read_only=True)
    estado_pedido = serializers.CharField(source="pedido.estado", read_only=True)

    class Meta:
        model = Factura
        fields = [
            "id",
            "pedido",
            "pedido_id",          # 🔥 Necesario para búsqueda/exportación
            "estado_pedido",      # 🔥 Necesario para reportes
            "numero_factura",
            "subtotal",
            "impuestos",
            "total",
            "url_pdf",
            "fecha",

            # Datos del usuario
            "usuario_nombre",
            "usuario_email",
            "usuario_identificacion",
        ]

        read_only_fields = [
            "id",
            "numero_factura",
            "url_pdf",
            "fecha",
            "pedido_id",
            "estado_pedido",
            "usuario_nombre",
            "usuario_email",
            "usuario_identificacion",
        ]

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

    # Validación total = subtotal + impuestos
    def validate(self, data):
        subtotal = data.get("subtotal")
        impuestos = data.get("impuestos")
        total = data.get("total")

        if subtotal is not None and impuestos is not None and total is not None:
            esperado = subtotal + impuestos
            if total != esperado:
                raise serializers.ValidationError({
                    "total": f"El total debe ser igual a subtotal + impuestos ({esperado})."
                })

        return data
