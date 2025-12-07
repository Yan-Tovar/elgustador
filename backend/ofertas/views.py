from datetime import date
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

from .models import Oferta
from .serializers import (
    OfertaSerializer,
    OfertaListSerializer,
    OfertaCreateUpdateSerializer
)

# 🔹 Importación de usuarios y servicio de notificaciones
from usuarios.models import Usuario
from notificaciones.services import crear_notificacion


class OfertaViewSet(viewsets.ModelViewSet):
    queryset = Oferta.objects.all().order_by("-id")
    serializer_class = OfertaSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        # Desactivar ofertas expiradas automáticamente
        Oferta.objects.filter(
            fecha_fin__lt=date.today(),
            estado=True
        ).update(estado=False)

        return super().list(request, *args, **kwargs)
        
    def is_admin(self, user):
        return hasattr(user, "rol") and user.rol == "admin"

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and self.is_admin(user):
            return Oferta.objects.all().order_by("-id")

        return Oferta.objects.filter(estado=True).order_by("-id")

    def get_serializer_class(self):
        if self.action == "list":
            return OfertaListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return OfertaCreateUpdateSerializer
        return OfertaSerializer

    # =============================================
    # CREAR OFERTA CON NOTIFICACIÓN
    # =============================================
    def perform_create(self, serializer):
        user = self.request.user

        if not self.is_admin(user):
            raise PermissionError("Solo el administrador puede crear ofertas.")

        oferta = serializer.save(creado_por=user)

        # Preparar notificación
        titulo = " Nueva Oferta Disponible "
        mensaje = (
            f"¡Tenemos una nueva oferta! Producto: **{oferta.producto.nombre}**\n"
            f"Descuento especial: ${oferta.descuento_porcentaje}\n"
            f"Válida hasta: {oferta.fecha_fin}"
        )

        # Enviar notificación a todos los usuarios registrados con email
        def enviar_notificaciones():
            for usuario in Usuario.objects.all():
                crear_notificacion(
                    usuario=usuario,
                    titulo=titulo,
                    mensaje=mensaje,
                    enviar_email=True  # Aquí se envía también el email
                )

        transaction.on_commit(enviar_notificaciones)

    # =============================================
    # Actualizar oferta
    # =============================================
    def perform_update(self, serializer):
        user = self.request.user

        if not self.is_admin(user):
            raise PermissionError("Solo el administrador puede actualizar ofertas.")

        serializer.save()

    # =============================================
    # Eliminar (desactivar) oferta
    # =============================================
    def destroy(self, request, *args, **kwargs):
        user = request.user

        if not self.is_admin(user):
            return Response(
                {"error": "No tienes permiso para eliminar ofertas."},
                status=status.HTTP_403_FORBIDDEN
            )

        oferta = self.get_object()
        oferta.estado = False
        oferta.save()

        return Response({"message": "Oferta desactivada correctamente."})
