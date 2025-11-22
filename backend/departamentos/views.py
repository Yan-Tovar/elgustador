from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Departamento
from .serializers import DepartamentoSerializer
from config.permissions import IsAdministrador

class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]  # Todos pueden ver
        else:
            permission_classes = [IsAuthenticated, IsAdministrador]  # Solo admin puede modificar
        return [permission() for permission in permission_classes]
