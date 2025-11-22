from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from usuarios.models import Usuario
from pedidos.models import Pedido
from productos.models import Producto

class PanelAdminOverview(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "usuarios_registrados": Usuario.objects.count(),
            "pedidos_totales": Pedido.objects.count(),
            "productos_totales": Producto.objects.count(),
        })
