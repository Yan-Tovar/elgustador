# notas/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Nota
from .serializers import (
    NotaSerializer,
    NotaListSerializer,
    NotaCreateUpdateSerializer,
)

class NotaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Nota.objects.all().order_by("-id")

    def get_queryset(self):
        """
        Cada usuario solo puede ver SUS notas activas.
        """
        return Nota.objects.filter(
            usuario=self.request.user,
            estado=True
        ).order_by("-id")

    def get_serializer_class(self):
        if self.action == "list":
            return NotaListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return NotaCreateUpdateSerializer
        return NotaSerializer

    def perform_create(self, serializer):
        """
        Asigna automáticamente el usuario logueado.
        """
        serializer.save(usuario=self.request.user)

    def perform_update(self, serializer):
        """
        Garantiza que la nota pertenezca al usuario.
        """
        nota = self.get_object()
        if nota.usuario != self.request.user:
            raise PermissionError("No puedes editar notas de otros usuarios.")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        """
        NO elimina. Solo desactiva.
        """
        nota = self.get_object()

        if nota.usuario != request.user:
            return Response({"error": "No puedes eliminar notas de otros usuarios."},
                            status=status.HTTP_403_FORBIDDEN)

        nota.estado = False
        nota.save()

        return Response({"message": "Nota desactivada correctamente."})
