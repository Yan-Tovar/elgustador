from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ProductoVisto
from .serializers import ProductosVistosSerializer

class ProductoVistoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductosVistosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductoVisto.objects.filter(usuario=self.request.user).select_related("producto")
