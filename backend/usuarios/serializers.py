# usuarios/serializers.py
from rest_framework import serializers
from .models import Usuario
from municipios.models import Municipio
from departamentos.models import Departamento

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ['id', 'nombre']

class MunicipioSerializer(serializers.ModelSerializer):
    departamento = DepartamentoSerializer(read_only=True)
    class Meta:
        model = Municipio
        fields = ['id', 'nombre', 'departamento', 'costo_envio', 'estado']

class UsuarioSerializer(serializers.ModelSerializer):
    municipio = MunicipioSerializer(read_only=True)
    departamento = DepartamentoSerializer(read_only=True)

    class Meta:
        model = Usuario
        exclude = ['password']

class UsuarioListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'identificacion', 'nombre', 'apellido', 'email', 'rol', 'estado']

class UsuarioRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['identificacion', 'nombre', 'apellido', 'email', 'password', 'telefono', 'municipio', 'departamento', 'direccion_detallada']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class UsuarioLoginSerializer(serializers.Serializer):
    identificacion = serializers.CharField()
    password = serializers.CharField(write_only=True)

class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(required=False, max_length=6)

class UsuarioUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = [
            "nombre",
            "apellido",
            "telefono",
            "direccion_detallada",
            "municipio",
            "departamento",
            "email"
        ]
        extra_kwargs = {
            "email": {"required": False},
            "municipio": {"required": False},
            "departamento": {"required": False},
        }
        
class UsuarioRolUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["rol"]

class UsuariosPorRolSerializer(serializers.Serializer):
    rol = serializers.CharField()
    total = serializers.IntegerField()


class UsuariosPorMesSerializer(serializers.Serializer):
    mes = serializers.CharField()
    total = serializers.IntegerField()


class UsuariosSesionSerializer(serializers.Serializer):
    total_en_sesion = serializers.IntegerField()