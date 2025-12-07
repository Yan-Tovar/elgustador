from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import UsuarioActividad
from .serializers import UsuarioActividadSerializer

class UsuarioActividadViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsuarioActividadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UsuarioActividad.objects.filter(usuario=self.request.user).order_by("-fecha")
