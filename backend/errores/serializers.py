# errores/serializers.py
from rest_framework import serializers
from .models import Errores

class ErrorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Errores
        fields = '__all__'