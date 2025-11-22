# errores/serializers.py
from rest_framework import serializers
from .models import ErrorRegistro

class ErrorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErrorRegistro
        fields = '__all__'