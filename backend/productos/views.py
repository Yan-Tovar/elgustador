from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.filters import SearchFilter

from rest_framework.views import APIView
from django.db.models import Sum, Count, Min, Max, F

from config.permissions import IsAdministrador
from .models import Producto
from .serializers import (
    ProductoSerializer,
    ProductoListSerializer,
    ProductoCreateUpdateSerializer,
)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by("nombre")
    serializer_class = ProductoSerializer

    filter_backends = [SearchFilter]
    search_fields = ["nombre", "descripcion", "precio", "categoria__nombre"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return []  # Público
        return [IsAdministrador()]

    def get_serializer_class(self):
        if self.action == "list":
            return ProductoListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return ProductoCreateUpdateSerializer
        return ProductoSerializer

    def get_queryset(self):
        user = self.request.user

        # Admin ve todos
        if hasattr(user, "rol") and user.rol == "admin":
            return Producto.objects.all().order_by("-id")

        # Usuarios ven solo activos
        return Producto.objects.filter(estado=True).order_by("-id")

    def destroy(self, request, *args, **kwargs):
        producto = self.get_object()

        if producto.stock > 0:
            return Response(
                {"error": "No puedes desactivar un producto que tiene stock mayor a 0."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        producto.estado = False
        producto.save()

        return Response({"message": "Producto desactivado correctamente."})


class ProductosPorCategoriaView(generics.ListAPIView):
    serializer_class = ProductoListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        categoria_id = self.kwargs["categoria_id"]
        return Producto.objects.filter(
            categoria_id=categoria_id,
            estado=True
        ).order_by("nombre")


class InventarioEstadisticasView(APIView):
    permission_classes = [IsAdministrador]

    def get(self, request):
        productos = Producto.objects.all()
        
        total = productos.count()
        activos = productos.filter(estado=True).count()
        inactivos = productos.filter(estado=False).count()

        stock_total = productos.aggregate(total_stock=Sum("stock"))["total_stock"] or 0

        stock_bajo = productos.filter(stock__lte=5).count()
        sin_stock = productos.filter(stock__lte=0).count()

        mayor_stock = productos.order_by("-stock").first()
        menor_stock = productos.filter(stock__gt=0).order_by("stock").first()

        # 💡 IMPORTANTE: Pasar context={'request': request}
        mayor_stock_data = (
            ProductoSerializer(mayor_stock, context={"request": request}).data
            if mayor_stock else None
        )

        menor_stock_data = (
            ProductoSerializer(menor_stock, context={"request": request}).data
            if menor_stock else None
        )

        return Response({
            "total_productos": total,
            "activos": activos,
            "inactivos": inactivos,
            "stock_total": stock_total,
            "stock_bajo": stock_bajo,
            "sin_stock": sin_stock,
            "producto_mayor_stock": mayor_stock_data,
            "producto_menor_stock": menor_stock_data,
        })


class InventarioReportesView(APIView):
    permission_classes = [IsAdministrador]

    def get(self, request):
        productos = Producto.objects.all()

        valor_inventario = productos.aggregate(
            total=Sum(F("precio") * F("stock"))
        )["total"] or 0

        stock_por_categoria = productos.values(
            "categoria__nombre"
        ).annotate(
            total_stock=Sum("stock")
        ).order_by("-total_stock")

        return Response({
            "valor_inventario": valor_inventario,
            "stock_por_categoria": stock_por_categoria,
        })