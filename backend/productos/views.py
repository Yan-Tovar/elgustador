from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
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

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return []  
        return [IsAdministrador()]

    def get_serializer_class(self):
        if self.action in ["list"]:
            return ProductoListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return ProductoCreateUpdateSerializer
        return ProductoSerializer

    def get_queryset(self):
        user = self.request.user

        # Admin ve todos los productos
        if hasattr(user, "rol") and user.rol == "admin":
            return Producto.objects.all().order_by("-id")

        return Producto.objects.filter(estado=True).order_by("-id")

    def destroy(self, request, *args, **kwargs):
        """
        No eliminar → solo cambiar estado = False
        """
        producto = self.get_object()

        if producto.stock > 0:
            return Response(
                {"error": "No puedes desactivar un producto que tiene stock mayor a 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        producto.estado = False
        producto.save()

        return Response({"message": "Producto desactivado correctamente."})
