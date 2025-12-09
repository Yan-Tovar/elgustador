# pqrs/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, mixins, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .models import PQRS
from .serializers import PqrsSerializer, PQRSUpdateEstadoSerializer
from config.permissions import IsAdministrador
from notificaciones.services import crear_notificacion

class PQRSViewSet(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    """
    - Crear: cualquier usuario, incluso anónimo
    - Listar / recuperar: solo administradores
    """
    serializer_class = PqrsSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            permission_classes = [AllowAny]  # cualquier usuario puede crear
        elif self.request.method in ["GET"]:
            permission_classes = [IsAuthenticated, IsAdministrador]
        else:
            permission_classes = [IsAuthenticated]  # bloquea PUT, PATCH, DELETE
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.rol == "admin":
            return PQRS.objects.all().order_by('-fecha')
        return PQRS.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(usuario=self.request.user)
        else:
            serializer.save(usuario=None)  # PQRS anónimo

# -------------------------
# Cambiar estado PQRS
# -------------------------
class ActualizarEstadoPQRSView(APIView):
    permission_classes = [IsAuthenticated, IsAdministrador]

    def patch(self, request, pk):
        pqrs = get_object_or_404(PQRS, pk=pk)
        serializer = PQRSUpdateEstadoSerializer(pqrs, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # Solo enviar notificación si el PQRS tiene usuario
            if pqrs.usuario:
                crear_notificacion(
                    usuario=pqrs.usuario,
                    titulo=f"PQRS de {pqrs.tipo} actualizado",
                    mensaje=f"El estado de tu PQRS ahora está '{pqrs.estado}'.",
                    enviar_email=True
                )

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
