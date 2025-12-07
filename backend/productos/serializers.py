from rest_framework import serializers
from .models import Producto
from categorias.serializers import CategoriaSerializer
from categorias.models import Categoria 
from django.core.exceptions import ImproperlyConfigured # Solo para referencia si se usa

class ProductoSerializer(serializers.ModelSerializer):
    """
    Serializer principal para lectura (GET) de productos, incluyendo la categoría anidada.
    """
    categoria = CategoriaSerializer(read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')


class ProductoListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listas.
    """
    class Meta:
        model = Producto
        fields = ['id', 'codigo', 'nombre', 'precio', 'precio_anterior', 'stock', 'imagen1']


class ProductoCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para la creación y actualización, manejando la conversión
    entre camelCase (frontend) y snake_case (modelo).
    """
    
    # 1. Clave Foránea (FK): El frontend envía 'categoria' con el ID.
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        # Si el campo del modelo es 'categoria' y el campo de envío es 'categoria', no se necesita 'source'.
    )
    
    # 2. Mapeo de campos camelCase (Frontend) a snake_case (Modelo)
    # Ejemplo: 'precioAnterior' del frontend -> 'precio_anterior' del modelo
    precioAnterior = serializers.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        source='precio_anterior', # Nombre del campo en el modelo
        required=False, 
        allow_null=True
    )
    
    datosNutricionales = serializers.CharField(
        source='datos_nutricionales', # Nombre del campo en el modelo
        required=False, 
        allow_blank=True
    )
    
    # 🚨 SOLUCIÓN del error anterior: 'instrucciones' (frontend) mapea a 'instrucciones_uso' (modelo)
    instrucciones = serializers.CharField(
        source='instrucciones_uso', # Nombre del campo en el modelo
        required=False, 
        allow_blank=True
    )


    class Meta:
        model = Producto
        # Usamos los nombres del serializer/frontend (incluyendo los camelCase mapeados)
        fields = [
            'codigo', 
            'nombre', 
            'marca', 
            'descripcion', 
            'precio', 
            'stock', 
            'color', 
            'peso', 
            'ingredientes', 
            'imagen1', 
            'imagen2', 
            'imagen3',
            'estado',
            
            # Campos mapeados: usar el nombre del serializer/frontend
            'categoria', 
            'precioAnterior',       # Mapeado a precio_anterior
            'datosNutricionales',   # Mapeado a datos_nutricionales
            'instrucciones',        # Mapeado a instrucciones_uso
        ]
        # Campos de solo lectura (no deben ser enviados por el frontend)
        read_only_fields = ('fecha_creacion', 'fecha_actualizacion')

    def validate(self, data):
        """
        Regla: no permitir desactivar un producto si stock > 0
        """
        # La lógica de validación debe usar los nombres de los campos *DEL MODELO* si accede
        # directamente a self.instance o self.initial_data. Sin embargo, data ya tiene
        # la estructura mapeada, así que podemos verificar 'estado'.
        
        if "estado" in data:
            estado = data.get("estado")
            producto = self.instance 

            # Si se intenta desactivar
            if estado is False:
                # Usamos .get("stock", 0) para manejar creación (donde self.instance es None)
                stock_actual = producto.stock if producto else data.get("stock", 0) 
                
                if stock_actual > 0:
                    raise serializers.ValidationError(
                        "No puedes desactivar un producto que tiene stock mayor a 0."
                    )

        return data