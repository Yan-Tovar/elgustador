from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from .models import Carrusel
from .serializers import CarruselSerializer

class CarruselViewSet(viewsets.ModelViewSet):
    queryset = Carrusel.objects.all().order_by("orden")
    serializer_class = CarruselSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [IsAuthenticatedOrReadOnly()]
        return [IsAdminUser()]
