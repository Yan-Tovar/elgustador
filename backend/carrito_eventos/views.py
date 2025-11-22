from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CarritoEventos
from .serializers import CarritoEventoSerializer

class CarritoEventoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CarritoEventoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CarritoEventos.objects.filter(usuario=self.request.user).select_related("producto")
