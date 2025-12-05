from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Carrusel
from .serializers import CarruselSerializer
from .pagination import AdminCarruselPagination

# Permisos personalizados
from config.permissions import IsCliente, IsEmpleado, IsAdministrador


class CarruselViewSet(viewsets.ModelViewSet):
    serializer_class = CarruselSerializer
    pagination_class = None  # se activa dinámicamente para admin

    # Necesario para permitir imágenes vía multipart/form-data
    parser_classes = [MultiPartParser, FormParser]

    # -----------------------------
    #  FILTRADO POR ROL
    # -----------------------------
    def get_queryset(self):
        user = self.request.user

        # ADMIN → ve todo
        if user.is_authenticated and user.rol == "admin":
            return Carrusel.objects.all().order_by("orden")

        # CLIENTE / EMPLEADO → solo carruseles activos
        return Carrusel.objects.filter(estado=True).order_by("orden")

    # -----------------------------
    #  PERMISOS POR ACCIÓN
    # -----------------------------
    def get_permissions(self):
        # Cliente y empleado pueden VER (list & retrieve)
        if self.action in ["list", "retrieve"]:
            return [IsEmpleado()]  # Cliente incluido

        # Crear, modificar, eliminar → SOLO administrador
        return [IsAdministrador()]

    # -----------------------------
    #  CREAR (con imagen)
    # -----------------------------
    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # -----------------------------
    #  EDITAR (con imagen opcional)
    # -----------------------------
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        data = request.data.copy()

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    # -----------------------------
    #  LISTADO CON PAGINACIÓN SOLO PARA ADMIN
    # -----------------------------
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # SI ES ADMIN → usar paginación
        if request.user.is_authenticated and request.user.rol == "admin":
            paginator = AdminCarruselPagination()
            page = paginator.paginate_queryset(queryset, request)

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return paginator.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        # NO ADMIN → sin paginación
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # -----------------------------
    #  SOFT DELETE (estado = False)
    # -----------------------------
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.estado = False
        instance.save()

        return Response(
            {"detail": "Carrusel desactivado (soft delete)."},
            status=status.HTTP_200_OK
        )
