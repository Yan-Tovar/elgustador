from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import UsuarioIngreso
from .serializers import UsuarioIngresoSerializer

class UsuarioIngresoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsuarioIngresoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UsuarioIngreso.objects.filter(usuario=self.request.user).order_by("-fecha")
