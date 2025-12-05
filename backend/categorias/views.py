from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from config.permissions import IsAdministrador
from .models import Categoria
from .serializers import (
    CategoriaSerializer,
    CategoriaListSerializer,
    CategoriaCreateUpdateSerializer
)

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by("nombre")
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticatedOrReadOnly()]
        return [IsAdministrador()]

    def get_serializer_class(self):
        if self.action == "list":
            return CategoriaListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return CategoriaCreateUpdateSerializer
        return CategoriaSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and user.rol == "admin":
            return Categoria.objects.all().order_by("nombre")

        return Categoria.objects.filter(estado=True).order_by("nombre")

    def destroy(self, request, *args, **kwargs):
        """
        No eliminar → desactivar
        """
        categoria = self.get_object()

        # Regla: no desactivar si tiene productos activos
        from productos.models import Producto
        productos_activos = Producto.objects.filter(
            categoria=categoria, estado=True
        ).count()

        if productos_activos > 0:
            return Response(
                {"error": "No puedes desactivar esta categoría porque tiene productos activos."},
                status=status.HTTP_400_BAD_REQUEST
            )

        categoria.estado = False
        categoria.save()

        return Response({"message": "Categoría desactivada correctamente."})

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault('context', {})
        kwargs['context']['request'] = self.request
        return super().get_serializer(*args, **kwargs)

