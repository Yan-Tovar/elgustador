from rest_framework import serializers
from .models import Producto
from categorias.serializers import CategoriaSerializer

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'


class ProductoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'codigo', 'nombre', 'precio', 'precio_anterior', 'stock', 'imagen1']


class ProductoCreateUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Producto
        fields = '__all__'

    def validate(self, data):
        """
        Regla: no permitir desactivar un producto si stock > 0
        """
        if "estado" in data:
            estado = data.get("estado")
            producto = self.instance  # None si es creación

            # Si se intenta desactivar
            if estado is False:
                stock_actual = producto.stock if producto else 0
                if stock_actual > 0:
                    raise serializers.ValidationError(
                        "No puedes desactivar un producto que tiene stock mayor a 0."
                    )

        return data
