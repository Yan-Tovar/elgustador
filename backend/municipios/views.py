from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Municipio
from .serializers import MunicipioSerializer

class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all().select_related("departamento")
    serializer_class = MunicipioSerializer
    permission_classes = [IsAuthenticated]