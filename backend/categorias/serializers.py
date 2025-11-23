from rest_framework import serializers
from .models import Categoria
from productos.models import Producto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class CategoriaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']


class CategoriaCreateUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Categoria
        fields = '__all__'

    def validate(self, data):
        """
        Regla:
        - No se puede desactivar una categoría que tenga productos activos (estado=True)
        """
        categoria = self.instance

        if categoria and "estado" in data:
            estado = data.get("estado")

            # si se intenta desactivar
            if estado is False:
                productos_activos = Producto.objects.filter(
                    categoria=categoria, estado=True
                ).count()

                if productos_activos > 0:
                    raise serializers.ValidationError(
                        "No puedes desactivar esta categoría porque tiene productos activos."
                    )

        return data
