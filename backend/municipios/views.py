from rest_framework import viewsets
from .models import Municipio
from .serializers import MunicipioSerializer

class MunicipioViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Municipio.objects.all().select_related("departamento")
    serializer_class = MunicipioSerializer
