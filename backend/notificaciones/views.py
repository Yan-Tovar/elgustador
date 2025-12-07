# notificaciones/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Notificacion
from .serializers import NotificacionSerializer

class NotificacionViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # --- LIMPIAR NOTIFICACIONES > 15 DÍAS ---
        hace_15_dias = timezone.now() - timedelta(days=15)
        Notificacion.objects.filter(fecha__lt=hace_15_dias).delete()

        # --- ORDENAR: NO LEÍDAS PRIMERO, LUEGO LEÍDAS ---
        return Notificacion.objects.filter(
            usuario=self.request.user,
            leido=False
        ).order_by("-fecha")  # más recientes primero

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def perform_update(self, serializer):
        serializer.save(leido=True)

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"detail": "Las notificaciones no se pueden eliminar."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
