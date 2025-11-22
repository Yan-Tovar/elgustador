from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Pago
from .serializers import PagoSerializer

class PagoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pago.objects.filter(usuario=self.request.user)
