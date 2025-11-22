from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Factura
from .serializers import FacturaSerializer

class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Factura.objects.filter(usuario=self.request.user)
