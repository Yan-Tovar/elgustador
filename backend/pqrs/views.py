from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import PQRS
from .serializers import PQRSSerializer

class PQRSViewSet(viewsets.ModelViewSet):
    serializer_class = PQRSSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PQRS.objects.filter(usuario=self.request.user)
