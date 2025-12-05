from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta

from carrito.models import Carrito
from pedidos.models import Pedido
from pedidos_detalles.models import PedidoDetalle
from .serializers import (
    PedidoSerializer,
    PedidoListSerializer,
    PedidoDetalleSerializer,
    PedidoEstadoSerializer
)
from config.permissions import IsCliente, IsEmpleado, IsAdministrador


# -------------------------
# Crear pedido desde carrito
# -------------------------
class CrearPedidoDesdeCarritoView(APIView):
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
        return Pedido.objects.filter(usuario=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return PedidoListSerializer
        return PedidoSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault("context", {})
        kwargs["context"]["request"] = self.request
        return super().get_serializer(*args, **kwargs)

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
# Detalles de pedido
# -------------------------
class PedidoDetalleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PedidoDetalleSerializer

    def get_queryset(self):
        queryset = PedidoDetalle.objects.all().select_related("producto", "pedido")

        pedido_id = self.request.query_params.get("pedido")
        if pedido_id:
            queryset = queryset.filter(pedido_id=pedido_id)

        return queryset

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault("context", {})
        kwargs["context"]["request"] = self.request
        return super().get_serializer(*args, **kwargs)


# -------------------------
# Pedidos por usuario
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

        serializer = PedidoSerializer(
            pedidos,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)


# -------------------------
# Pedidos empleados
# -------------------------
class PedidosEmpleadoView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsEmpleado]

    def get(self, request):
        pedidos = (
            Pedido.objects
            .exclude(estado="pendiente")
            .prefetch_related('detalles__producto')
        )

        serializer = PedidoSerializer(
            pedidos,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)


# -------------------------
# Pedidos admin
# -------------------------
class PedidosAdminView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdministrador]

    def get(self, request):
        pedidos = Pedido.objects.all().prefetch_related('detalles__producto')

        serializer = PedidoSerializer(
            pedidos,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)


# -------------------------
# Actualizar estado
# -------------------------
class ActualizarEstadoPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.rol in ["admin", "empleado"]:
            pedido = get_object_or_404(Pedido, pk=pk)
        else:
            pedido = get_object_or_404(Pedido, pk=pk, usuario=request.user)

        serializer = PedidoEstadoSerializer(
            pedido,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)


# -------------------------
# Estadísticas de pedidos
# -------------------------
class PedidosStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        qs = Pedido.objects.all()

        if start_date:
            qs = qs.filter(fecha_creacion__date__gte=start_date)
        if end_date:
            qs = qs.filter(fecha_creacion__date__lte=end_date)

        agregados = (
            qs
            .annotate(date=TruncDate("fecha_creacion"))
            .values("date", "estado")
            .annotate(count=Count("id"))
            .order_by("date", "estado")
        )

        result = [
            {
                "date": a["date"].isoformat(),
                "estado": a["estado"],
                "count": a["count"]
            }
            for a in agregados
        ]

        return Response({"data": result}, status=200)
