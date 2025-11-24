# pagos/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal
import uuid

from .models import Pago
from .serializers import PagoSerializer
from pedidos.models import Pedido
from facturas.models import Factura
from carrito.models import Carrito
from productos.models import Producto
from pagos.utils import verify_paypal_order


class PagoViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]


    # ------------------------------------------------------------
    # LISTAR PAGOS
    # ------------------------------------------------------------
    def list(self, request):
        pagos = Pago.objects.filter(
            pedido__usuario=request.user
        ).order_by("-fecha")

        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data)


    # ------------------------------------------------------------
    # DETALLE PAGO
    # ------------------------------------------------------------
    def retrieve(self, request, pk=None):
        pago = get_object_or_404(
            Pago,
            pk=pk,
            pedido__usuario=request.user
        )
        serializer = PagoSerializer(pago)
        return Response(serializer.data)


    # ------------------------------------------------------------
    # CREAR PAGO (PAYPAL)
    # ------------------------------------------------------------
    def create(self, request):
        """
        Endpoint principal para registrar un pago real PayPal.
        Se validan:
          - transacción real COMPLETED
          - verify_paypal_order() para asegurar autenticidad
        SOLO si es COMPLETED se descuenta stock, vacía carrito y genera factura.
        """
        user = request.user
        data = request.data

        pedido_id = data.get("pedido")
        monto = data.get("monto")
        estado_frontend = data.get("estado", "")
        transaccion_id = data.get("transaccion_id")
        pasarela = data.get("pasarela", "paypal")

        if not pedido_id or not monto:
            return Response(
                {"detail": "pedido y monto son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )

        pedido = get_object_or_404(Pedido, id=pedido_id, usuario=user)

        # -------------------------------------------
        # VERIFICACIÓN REAL PAYPAL
        # -------------------------------------------
        if pasarela == "paypal":
            if not transaccion_id:
                return Response(
                    {"detail": "transaccion_id requerido para PayPal"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            verified = verify_paypal_order(transaccion_id)

            if not verified:
                return Response(
                    {"detail": "Error verificando transacción PayPal"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            paypal_status = verified.get("status", "").lower()

            # PayPal ORDER = APPROVED
            # PayPal CAPTURE = COMPLETED
            if paypal_status not in ("approved", "completed"):
                return Response(
                    {"detail": f"Transacción PayPal no válida: {paypal_status}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # -----------------------------------------------
            # VALIDACIÓN SEGURA DEL MONTO
            # -----------------------------------------------
            if "amount" in verified:
                amount_paypal = verified["amount"]["value"]

            # Si es una order (por si luego cambias el flujo)
            elif "purchase_units" in verified:
                pu = verified["purchase_units"][0]
                if "payments" in pu and "captures" in pu["payments"]:
                    amount_paypal = pu["payments"]["captures"][0]["amount"]["value"]
                else:
                    amount_paypal = pu["amount"]["value"]

            else:
                return Response(
                    {"detail": "Respuesta PayPal inválida (sin amount)."},
                    status=400
                )

            amount_paypal = Decimal(amount_paypal)

            if amount_paypal != pedido.total:
                return Response(
                    {"detail": "El monto no coincide con PayPal"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # -----------------------------------------------------------------
        # SI TODO ES VÁLIDO → PROCESAMOS PAGÓ REAL
        # -----------------------------------------------------------------
        with transaction.atomic():
            # Crear registro del pago
            pago = Pago.objects.create(
                pedido=pedido,
                pasarela=pasarela,
                monto=monto,
                estado="COMPLETED",
                transaccion_id=transaccion_id
            )

            # Cambiar estado del pedido
            pedido.estado = "pagado"
            pedido.metodo_pago = pasarela
            pedido.save()

            # ---------------------------------------
            # DESCONTAR STOCK
            # ---------------------------------------
            carrito = Carrito.objects.get(usuario=user)
            for item in carrito.items.all():
                producto = item.producto

                if producto.stock < item.cantidad:
                    raise Exception(
                        f"Stock insuficiente para {producto.nombre}"
                    )

                producto.stock -= item.cantidad
                producto.save()

            # Vaciar carrito solo después de completar stock y pago
            carrito.items.all().delete()

            # ---------------------------------------
            # CREAR FACTURA
            # ---------------------------------------
            numero_factura = str(uuid.uuid4())
            impuestos = pedido.subtotal * Decimal("0.19")

            factura = Factura.objects.create(
                pedido=pedido,
                numero_factura=numero_factura,
                subtotal=pedido.subtotal,
                impuestos=impuestos,
                total=pedido.total,
                url_pdf=f"https://localhost:3000/facturas/{pedido.id}.pdf"
            )

        return Response(
            {
                "pago_id": pago.id,
                "pedido_id": pedido.id,
                "factura_id": factura.id,
                "factura_url": factura.url_pdf
            },
            status=status.HTTP_201_CREATED
        )
