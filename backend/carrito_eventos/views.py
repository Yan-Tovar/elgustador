from rest_framework.generics import ListAPIView
from .models import CarritoEvento
from .serializers import CarritoEventoSerializer
from config.permissions import IsAdministrador

class CarritoEventosList(ListAPIView):
    permission_classes = [IsAdministrador]
    serializer_class = CarritoEventoSerializer
    queryset = CarritoEvento.objects.all().order_by("-fecha")
