from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from config.permissions import IsAdministrador
from usuarios.models import Usuario # <-- Importación específica de tu modelo
from .models import Categoria
from .serializers import (
    CategoriaSerializer,
    CategoriaListSerializer,
    CategoriaCreateUpdateSerializer
)

# IMPORTACIONES NECESARIAS
from notificaciones.services import crear_notificacion
from django.db import transaction # Ya no necesitamos get_user_model si importamos Usuario
# -------------------------

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
    
    # ====================================================================
    # Método Sobreescrito para enviar notificaciones al crear categoría
    # ====================================================================
    def perform_create(self, serializer):
        # 1. Guardar la instancia de la categoría
        categoria = serializer.save()
        
        # 2. Obtener los detalles para la notificación
        titulo = "¡Nueva Categoría Disponible! 🏷️"
        mensaje = f"Se ha añadido una nueva categoría: **{categoria.nombre}**. ¡Échale un vistazo a los nuevos productos!"

        # 3. Definir la función de notificación que se ejecutará en el commit
        def send_notifications_to_all():
            # Itera sobre todos los objetos del modelo Usuario importado
            for usuario in Usuario.objects.all():
                crear_notificacion(
                    usuario=usuario,
                    titulo=titulo,
                    mensaje=mensaje,
                    enviar_email=False # Falso para no enviar correo
                )

        # 4. Registrar la función para que se ejecute después del commit
        transaction.on_commit(send_notifications_to_all)
        
    # ====================================================================
    # Fin de método perform_create
    # ====================================================================

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