from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Carrito, CarritoItem
from .serializers import CarritoSerializer, CarritoItemSerializer
from config.permissions import IsEmpleado
from carrito_eventos.models import CarritoEvento
from productos.models import Producto


class CarritoView(APIView):
    permission_classes = [IsEmpleado]

    def get(self, request):
        carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)


class CarritoAgregarProducto(APIView):
    permission_classes = [IsEmpleado]

    def post(self, request):
        carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
        producto_id = request.data.get("producto_id")
        cantidad = int(request.data.get("cantidad", 1))

        item, created = CarritoItem.objects.get_or_create(
            carrito=carrito,
            producto_id=producto_id,
            defaults={"cantidad": 0}
        )

        nuevo_total = item.cantidad + cantidad
        producto = item.producto

        # Si supera stock
        if nuevo_total > producto.stock:
            cantidad_agregada = producto.stock - item.cantidad
            item.cantidad = producto.stock
            item.save()

            # Registrar evento (solo si realmente añadió algo)
            if cantidad_agregada > 0:
                CarritoEvento.objects.create(
                    usuario=request.user,
                    producto=producto,
                    accion="agregar",
                    cantidad=cantidad_agregada
                )

            return Response({
                "warning": True,
                "message": f"Stock superado. Solo se añadieron {cantidad_agregada} unidades (stock: {producto.stock}).",
                "item": CarritoItemSerializer(item).data
            }, status=status.HTTP_200_OK)

        # Si NO supera el stock
        item.cantidad = nuevo_total
        item.save()

        # Registrar evento
        CarritoEvento.objects.create(
            usuario=request.user,
            producto=producto,
            accion="agregar",
            cantidad=cantidad
        )

        return Response({
            "warning": False,
            "message": "Producto agregado correctamente.",
            "item": CarritoItemSerializer(item).data
        }, status=status.HTTP_201_CREATED)

class CarritoActualizarCantidad(APIView):
    permission_classes = [IsEmpleado]

    def put(self, request, item_id):
        nueva_cantidad = int(request.data.get("cantidad", 1))

        item = get_object_or_404(
            CarritoItem,
            id=item_id,
            carrito__usuario=request.user
        )
        producto = item.producto

        # Guardar cantidad anterior ANTES del cambio
        cantidad_anterior = item.cantidad

        # --- VALIDAR STOCK ---
        if nueva_cantidad > producto.stock:
            cantidad_aplicada = producto.stock
            diferencia = cantidad_aplicada - cantidad_anterior  # diferencia real

            item.cantidad = cantidad_aplicada
            item.save()

            if diferencia != 0:
                CarritoEvento.objects.create(
                    usuario=request.user,
                    producto=producto,
                    accion="cambiar_cantidad",
                    cantidad=abs(diferencia)
                )

            return Response({
                "warning": True,
                "message": f"La cantidad supera el stock. Se ajustó a {producto.stock}.",
                "item": CarritoItemSerializer(item).data
            })

        # --- CAMBIO NORMAL ---
        diferencia = nueva_cantidad - cantidad_anterior

        # Guardar el nuevo valor
        item.cantidad = nueva_cantidad
        item.save()

        # Registrar evento si hubo cambio real
        if diferencia != 0:
            if diferencia > 0:
                # Se agregaron productos
                accion = "agregar"
            else:
                # Se eliminaron productos
                accion = "eliminar"

            CarritoEvento.objects.create(
                usuario=request.user,
                producto=producto,
                accion=accion,
                cantidad=abs(diferencia)  # número real de unidades cambiadas
            )

        return Response({
            "warning": False,
            "message": "Cantidad actualizada.",
            "item": CarritoItemSerializer(item).data
        })

class CarritoEliminarItem(APIView):
    permission_classes = [IsEmpleado]

    def delete(self, request, item_id):
        item = get_object_or_404(CarritoItem, id=item_id, carrito__usuario=request.user)

        CarritoEvento.objects.create(
            usuario=request.user,
            producto=item.producto,
            accion="vaciar",
            cantidad=item.cantidad
        )

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
