from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Pedido, PedidoDetalle
from .serializers import (
    PedidoSerializer,
    PedidoListSerializer,
    PedidoDetalleSerializer
)

class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(usuario=self.request.user).prefetch_related("detalles")

    def get_serializer_class(self):
        if self.action == "list":
            return PedidoListSerializer
        return PedidoSerializer

class PedidoDetalleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PedidoDetalle.objects.all().select_related("producto")
    serializer_class = PedidoDetalleSerializer
