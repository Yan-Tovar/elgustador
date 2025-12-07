from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import PedidoDetalle
from .serializers import PedidoDetalleSerializer

class PedidoDetalleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PedidoDetalleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PedidoDetalle.objects.filter(pedido__usuario=self.request.user).select_related("producto", "pedido")
