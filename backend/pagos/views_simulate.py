# pagos/views_simulate.py

import uuid
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from pedidos.models import Pedido
from pagos.models import Pago
from carrito.models import Carrito
from facturas.models import Factura


class SimulatePagoView(APIView):
    """
    Vista independiente para simular un pago.
    Descuenta stock, crea pago simulado, factura y vacía carrito.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        pedido_id = data.get("pedido")
        monto = data.get("monto")

        if not pedido_id or not monto:
            return Response(
                {"detail": "pedido y monto son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        pedido = get_object_or_404(Pedido, id=pedido_id, usuario=user)

        with transaction.atomic():

            # -----------------------------------------
            # 1. DESCONTAR STOCK
            # -----------------------------------------
            for item in pedido.detalles.all():
                producto = item.producto

                if producto.stock < item.cantidad:
                    return Response(
                        {
                            "detail": f"Stock insuficiente para {producto.nombre}. "
                                      f"Disponible: {producto.stock}."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                producto.stock -= item.cantidad
                producto.save()

            # -----------------------------------------
            # 2. Registrar pago simulado
            # -----------------------------------------
            pago = Pago.objects.create(
                pedido=pedido,
                pasarela="simulado",
                monto=monto,
                estado="COMPLETED",
                transaccion_id=f"SIM-{uuid.uuid4()}"
            )

            pedido.estado = "pagado"
            pedido.metodo_pago = "simulado"
            pedido.save()

            # -----------------------------------------
            # 3. Vaciar carrito
            # -----------------------------------------
            try:
                carrito = Carrito.objects.get(usuario=user)
                carrito.items.all().delete()
            except Carrito.DoesNotExist:
                pass

            # -----------------------------------------
            # 4. Generar factura
            # -----------------------------------------
            numero_factura = str(uuid.uuid4())
            impuestos = pedido.subtotal * Decimal("0.19")

            factura = Factura.objects.create(
                pedido=pedido,
                numero_factura=numero_factura,
                subtotal=pedido.subtotal,
                impuestos=impuestos,
                total=pedido.total,
                url_pdf=f"https://tuapp.com/facturas/{pedido.id}.pdf"
            )

        return Response(
            {
                "pago_id": pago.id,
                "pedido_id": pedido.id,
                "factura_id": factura.id,
                "factura_url": factura.url_pdf,
            },
            status=status.HTTP_201_CREATED
        )
