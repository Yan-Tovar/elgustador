# facturas/views.py
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from config.permissions import IsAdministrador
from .models import Factura
from .serializers import FacturaSerializer

# ----------- VIEWSET PRINCIPAL -----------

class FacturaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FacturaSerializer

    def get_queryset(self):
        return Factura.objects.filter(pedido__usuario=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        factura = serializer.save()
        return Response(self.get_serializer(factura).data, status=status.HTTP_201_CREATED)


# ----------- VISTA: Facturas del Usuario -----------

class FacturasUsuarioView(generics.ListAPIView):
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Factura.objects.filter(pedido__usuario=self.request.user)


# ----------- VISTA: Facturas para Admin -----------

class FacturasAdminView(generics.ListAPIView):
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]

    def get_queryset(self):
        return Factura.objects.all()
