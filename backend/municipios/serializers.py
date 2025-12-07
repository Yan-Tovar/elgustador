# municipios/serializers.py
from rest_framework import serializers
from .models import Municipio
from departamentos.models import Departamento
from departamentos.serializers import DepartamentoSerializer


class MunicipioSerializer(serializers.ModelSerializer):
    departamento = DepartamentoSerializer(read_only=True)
    departamento_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Municipio
        fields = [
            'id',
            'nombre',
            'departamento',
            'departamento_id',
            'costo_envio',
            'estado'
        ]

    # -------------------------------
    # VALIDACIONES DE CAMPOS
    # -------------------------------
    def validate_nombre(self, value):
        if not value or value.strip() == "":
            raise serializers.ValidationError("El nombre es obligatorio.")
        if len(value) < 2:
            raise serializers.ValidationError("El nombre es muy corto.")
        return value

    def validate_costo_envio(self, value):
        # Permitir costo_envio vacío → convertir a 0
        if value in ["", None]:
            return 0

        try:
            value = float(value)
        except:
            raise serializers.ValidationError("El costo de envío debe ser un número.")

        if value < 0:
            raise serializers.ValidationError("El costo de envío no puede ser negativo.")

        return value

    def validate_departamento_id(self, value):
        try:
            dep = Departamento.objects.get(id=value)
        except Departamento.DoesNotExist:
            raise serializers.ValidationError("El departamento no existe.")

        if not dep.estado:
            raise serializers.ValidationError("Solo se pueden usar departamentos activos.")

        return value

    # -------------------------------
    # CREATE
    # -------------------------------
    def create(self, validated_data):
        departamento_id = validated_data.pop("departamento_id")
        departamento = Departamento.objects.get(id=departamento_id)

        validated_data["departamento"] = departamento

        return Municipio.objects.create(**validated_data)

    # -------------------------------
    # UPDATE
    # -------------------------------
    def update(self, instance, validated_data):

        # Cambio de departamento
        if "departamento_id" in validated_data:
            departamento_id = validated_data.pop("departamento_id")
            departamento = Departamento.objects.get(id=departamento_id)

            if not departamento.estado:
                raise serializers.ValidationError("Solo se pueden usar departamentos activos.")

            instance.departamento = departamento

        # Actualizar costo_envio validando nuevamente
        if "costo_envio" in validated_data:
            validated_data["costo_envio"] = self.validate_costo_envio(
                validated_data["costo_envio"]
            )

        return super().update(instance, validated_data)
