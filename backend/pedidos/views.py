# pedidos/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta

from rest_framework.pagination import PageNumberPagination

from carrito.models import Carrito
from pedidos.models import Pedido
from pedidos_detalles.models import PedidoDetalle
from .serializers import (
    PedidoSerializer,
    PedidoListSerializer,
    PedidoDetalleSerializer,
    PedidoEstadoSerializer,
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
            return Response({"detail": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

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
            estado="pendiente",
        )

        for item in carrito.items.all():
            PedidoDetalle.objects.create(
                pedido=pedido,
                producto=item.producto,
                cantidad=item.cantidad,
                precio_unitario=item.precio_unitario,
                precio_total=item.subtotal,
            )

        return Response({"pedido_id": pedido.id}, status=status.HTTP_201_CREATED)


# -------------------------
# ViewSet de pedidos
# -------------------------
class PedidoViewSet(viewsets.ModelViewSet):
    """
    - Admin / Empleado: pueden ver todos los pedidos (excepto pendientes si así lo requiere).
    - Cliente: solo sus propios pedidos (excluye 'pendiente').
    - La eliminación de pedidos NO está permitida por política: devuelve 405.
    """
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Normalize role check: soporta "admin" y "administrador"
        is_admin = getattr(user, "rol", "") in ("admin", "administrador")
        is_empleado = getattr(user, "rol", "") == "empleado"

        if is_admin or is_empleado:
            # Admin y empleado ven todos los pedidos (excluí pendiente si lo deseas)
            return Pedido.objects.all().exclude(estado="pendiente")
        # Cliente ve solo los suyos (excluye pendientes)
        return Pedido.objects.filter(usuario=user).exclude(estado="pendiente")

    def get_serializer_class(self):
        if self.action == "list":
            return PedidoListSerializer
        return PedidoSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault("context", {})
        kwargs["context"]["request"] = self.request
        return super().get_serializer(*args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Política: nunca eliminar pedidos desde la API
        return Response(
            {"detail": "Eliminación de pedidos no permitida."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )


# -------------------------
# Detalles de pedido
# -------------------------
class PedidoDetalleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset para detalles del pedido.
    - Admin / Empleado: pueden consultar cualquier detalle (si se les permite).
    - Cliente: solo detalles de sus propios pedidos.
    Soporta filtro por query param `pedido=<id>`.
    """
    serializer_class = PedidoDetalleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = PedidoDetalle.objects.all().select_related("producto", "pedido")

        pedido_id = self.request.query_params.get("pedido")
        if pedido_id:
            queryset = queryset.filter(pedido_id=pedido_id)

        # Normalización de roles
        is_admin = getattr(user, "rol", "") in ("admin", "administrador")
        is_empleado = getattr(user, "rol", "") == "empleado"

        if is_admin or is_empleado:
            return queryset

        # Cliente: solo sus propios detalles
        return queryset.filter(pedido__usuario=user)

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault("context", {})
        kwargs["context"]["request"] = self.request
        return super().get_serializer(*args, **kwargs)


class PedidosPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "results": data,
            "count": self.page.paginator.count,
            "total_pages": self.page.paginator.num_pages,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
        })


# -------------------------
# Pedidos por usuario (paginado)
# -------------------------
class PedidosUsuarioView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = PedidosPagination

    def get(self, request):
        estado = request.query_params.get("estado")
        search = request.query_params.get("search")

        pedidos = (
            Pedido.objects
            .filter(usuario=request.user)
            .exclude(estado="pendiente")
            .prefetch_related("detalles__producto")
        )

        if estado and estado != "todos":
            pedidos = pedidos.filter(estado=estado)

        if search:
            pedidos = pedidos.filter(
                Q(id__icontains=search) |
                Q(fecha_creacion__date__icontains=search)
            )

        pedidos = pedidos.order_by("-fecha_creacion")

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(pedidos, request)

        serializer = PedidoSerializer(result_page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)


# -------------------------
# Pedidos empleados (paginado + búsqueda + estado)
# -------------------------
class PedidosEmpleadoView(APIView):
    permission_classes = [IsAuthenticated, IsEmpleado]
    pagination_class = PedidosPagination

    def get(self, request):
        estado = request.query_params.get("estado")
        search = request.query_params.get("search")

        pedidos = (
            Pedido.objects
            .exclude(estado="pendiente")
            .prefetch_related("detalles__producto")
        )

        if estado and estado != "todos":
            pedidos = pedidos.filter(estado=estado)

        if search:
            pedidos = pedidos.filter(
                Q(id__icontains=search) |
                Q(usuario__email__icontains=search) |
                Q(fecha_creacion__date__icontains=search)
            )

        pedidos = pedidos.order_by("-fecha_creacion")

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(pedidos, request)

        serializer = PedidoSerializer(result_page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)


# -------------------------
# Pedidos admin (paginado + búsqueda + estado)
# -------------------------
class PedidosAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdministrador]
    pagination_class = PedidosPagination

    def get(self, request):
        estado = request.query_params.get("estado")
        search = request.query_params.get("search")

        pedidos = (
            Pedido.objects
            .all()
            .prefetch_related("detalles__producto")
        )

        if estado and estado != "todos":
            pedidos = pedidos.filter(estado=estado)

        if search:
            pedidos = pedidos.filter(
                Q(id__icontains=search) |
                Q(usuario__email__icontains=search) |
                Q(fecha_creacion__date__icontains=search)
            )

        pedidos = pedidos.order_by("-fecha_creacion")

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(pedidos, request)

        serializer = PedidoSerializer(result_page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)


# -------------------------
# Actualizar estado
# -------------------------
class ActualizarEstadoPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        # Permitir a admin/empleado modificar cualquier pedido; cliente solo el suyo
        user = request.user
        if getattr(user, "rol", "") in ["admin", "administrador", "empleado"]:
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
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

        return Response({"data": result}, status=status.HTTP_200_OK)
