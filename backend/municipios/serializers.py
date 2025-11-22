# municipios/serializers.py
from rest_framework import serializers
from .models import Municipio
from departamentos.serializers import DepartamentoSerializer

class MunicipioSerializer(serializers.ModelSerializer):
    departamento = DepartamentoSerializer(read_only=True)
    class Meta:
        model = Municipio
        fields = ['id', 'nombre', 'departamento', 'costo_envio', 'estado']