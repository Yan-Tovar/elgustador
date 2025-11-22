from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Carrito
from carrito_eventos.models import CarritoEvento
from .serializers import CarritoSerializer
from carrito_eventos.serializers import CarritoEventoSerializer
from productos.models import Producto

class CarritoViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
        return Response(CarritoSerializer(carrito).data)

    def create(self, request):
        producto_id = request.data.get("producto_id")
        cantidad = int(request.data.get("cantidad", 1))

        producto = Producto.objects.get(id=producto_id)
        carrito, _ = Carrito.objects.get_or_create(usuario=request.user)

        carrito.agregar_producto(producto, cantidad)
        return Response({"mensaje": "Producto agregado"})

    def destroy(self, request, pk=None):
        producto = Producto.objects.get(id=pk)
        carrito = Carrito.objects.get(usuario=request.user)

        carrito.eliminar_producto(producto)
        return Response({"mensaje": "Producto eliminado"})

class CarritoEventoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarritoEvento.objects.all()  
    serializer_class = CarritoEventoSerializer
    permission_classes = [IsAuthenticated]
