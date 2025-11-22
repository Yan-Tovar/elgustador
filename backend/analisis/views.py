from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from pedidos.models import Pedido
from productos.models import Producto

class AnalisisView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = {
            "total_pedidos": Pedido.objects.count(),
            "productos_activos": Producto.objects.filter(estado=True).count(),
            "ventas_totales": sum(p.total for p in Pedido.objects.filter(estado="pagado"))
        }
        return Response(data)
