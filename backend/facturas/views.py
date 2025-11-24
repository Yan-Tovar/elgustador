# facturas/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .models import Factura
from .serializers import FacturaSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class FacturaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FacturaSerializer

    def get_queryset(self):
        return Factura.objects.filter(pedido__usuario=self.request.user)

    def create(self, request, *args, **kwargs):
        # Si quisieras permitir creación manual desde frontend:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        factura = serializer.save()
        return Response(self.get_serializer(factura).data, status=status.HTTP_201_CREATED)
