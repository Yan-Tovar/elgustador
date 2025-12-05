from rest_framework import serializers
from .models import Categoria
from productos.models import Producto

class CategoriaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = '__all__'
        extra_fields = ['imagen_url']

    def get_imagen_url(self, obj):
        request = self.context.get("request")

        if obj.imagen:
            return request.build_absolute_uri(obj.imagen.url)
        return None



class CategoriaListSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = '__all__'

    def get_imagen_url(self, obj):
        request = self.context.get("request")

        # Si no hay request, devolver URL relativa o vacía
        if not request:
            return obj.imagen.url if obj.imagen else None

        return request.build_absolute_uri(obj.imagen.url) if obj.imagen else None


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
