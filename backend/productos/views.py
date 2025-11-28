from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter

from config.permissions import IsAdministrador
from .models import Producto
from .serializers import (
    ProductoSerializer,
    ProductoListSerializer,
    ProductoCreateUpdateSerializer,
)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by("nombre")
    serializer_class = ProductoSerializer

    #  HABILITAR BÚSQUEDA
    filter_backends = [SearchFilter]
    search_fields = ["nombre", "descripcion", "precio", "categoria__nombre"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return []  # Público
        return [IsAdministrador()]

    def get_serializer_class(self):
        if self.action in ["list"]:
            return ProductoListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return ProductoCreateUpdateSerializer
        return ProductoSerializer

    def get_queryset(self):
        user = self.request.user

        # Admin ve todos
        if hasattr(user, "rol") and user.rol == "admin":
            return Producto.objects.all().order_by("-id")

        # Usuarios ven solo activos
        return Producto.objects.filter(estado=True).order_by("-id")

    def destroy(self, request, *args, **kwargs):
        producto = self.get_object()

        if producto.stock > 0:
            return Response(
                {"error": "No puedes desactivar un producto que tiene stock mayor a 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        producto.estado = False
        producto.save()

        return Response({"message": "Producto desactivado correctamente."})
