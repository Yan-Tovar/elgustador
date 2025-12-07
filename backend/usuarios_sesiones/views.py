from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import UsuarioSesion
from .serializers import UsuarioSesionSerializer

class UsuarioSesionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsuarioSesionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UsuarioSesion.objects.filter(usuario=self.request.user).order_by("-inicio")
