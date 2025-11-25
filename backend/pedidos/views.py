from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from carrito.models import Carrito
from pedidos.models import Pedido
from pedidos_detalles.models import PedidoDetalle
from .serializers import PedidoSerializer, PedidoListSerializer, PedidoDetalleSerializer, PedidoEstadoSerializer
from config.permissions import IsCliente, IsEmpleado, IsAdministrador

# -------------------------
# Crear pedido + detalle
# -------------------------
class CrearPedidoDesdeCarritoView(APIView):
    """
    Paso 1: Crear el pedido basado en el carrito
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        usuario = request.user

        carrito = get_object_or_404(Carrito, usuario=usuario)

        if carrito.items.count() == 0:
            return Response({"detail": "El carrito está vacío."}, status=400)

        subtotal = sum(item.subtotal for item in carrito.items.all())
        costo_envio = 12000
        total = subtotal + costo_envio

        pedido = Pedido.objects.create(
            usuario=usuario,
            municipio=usuario.municipio,
            departamento=usuario.departamento,
            direccion_detallada=usuario.direccion_detallada or "",
            subtotal=subtotal,
            costo_envio=costo_envio,
            metodo_pago="pendiente",
            total=total,
            estado="pendiente"
        )

        for item in carrito.items.all():
            PedidoDetalle.objects.create(
                pedido=pedido,
                producto=item.producto,
                cantidad=item.cantidad,
                precio_unitario=item.precio_unitario,
                precio_total=item.subtotal
            )

        return Response({"pedido_id": pedido.id}, status=201)

# -------------------------
# ViewSet de pedidos
# -------------------------
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Para evitar que un usuario vea pedidos de otros
        user = self.request.user
        return Pedido.objects.filter(usuario=user)

    def get_serializer_class(self):
        if self.action == "list":
            return PedidoListSerializer
        return PedidoSerializer

    # Método para eliminar pedidos pendientes de más de 30 días
    def destroy(self, request, *args, **kwargs):
        pedido = self.get_object()
        if pedido.estado != "pendiente":
            return Response({"detail": "Solo se pueden eliminar pedidos pendientes"}, status=400)

        if (timezone.now() - pedido.fecha_creacion) > timedelta(days=30):
            pedido.delete()
            return Response({"detail": "Pedido eliminado"}, status=200)
        else:
            return Response({"detail": "No han pasado 30 días desde la creación"}, status=400)


# -------------------------
# ViewSet de detalle de pedidos (solo lectura)
# -------------------------
class PedidoDetalleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PedidoDetalleSerializer

    def get_queryset(self):
        queryset = PedidoDetalle.objects.all().select_related("producto", "pedido")

        pedido_id = self.request.query_params.get("pedido")

        if pedido_id:
            queryset = queryset.filter(pedido_id=pedido_id)

        return queryset

# -------------------------
# Vistas separadas por tipo de pedidos
# -------------------------
class PedidosUsuarioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pedidos = (
            Pedido.objects
            .filter(usuario=request.user)
            .exclude(estado="pendiente")           
            .prefetch_related('detalles__producto')
        )

        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

class PedidosEmpleadoView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmpleado]

    def get(self, request):
        pedidos = Pedido.objects.exclude(estado="pendiente").prefetch_related('detalles__producto')
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)


class PedidosAdminView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdministrador]

    def get(self, request):
        pedidos = Pedido.objects.all().prefetch_related('detalles__producto')
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

class ActualizarEstadoPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            pedido = Pedido.objects.get(pk=pk, usuario=request.user)
        except Pedido.DoesNotExist:
            return Response(
                {"detail": "Pedido no encontrado o no pertenece al usuario."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PedidoEstadoSerializer(pedido, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)