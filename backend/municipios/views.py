from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Municipio
from .serializers import MunicipioSerializer

class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all().select_related("departamento")
    serializer_class = MunicipioSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]