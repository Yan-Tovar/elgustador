# facturas/views.py
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import FileResponse
from django.core.mail import EmailMessage
from django.conf import settings
from django.utils import timezone

from config.permissions import IsAdministrador
from .models import Factura
from pedidos.models import Pedido
from pedidos_detalles.models import PedidoDetalle
from .serializers import FacturaSerializer

import io
import os  

# ReportLab
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from reportlab.lib.units import cm


def generar_pdf_factura(factura):
    buffer = io.BytesIO()

    pdf = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=50,
    )

    # Metadata del PDF
    pdf.title = f"Factura Electrónica #{factura.id}"
    pdf.author = "El Gustador"
    pdf.subject = "Factura electrónica de venta"
    pdf.keywords = "Factura, El Gustador, Venta"

    pedido = factura.pedido
    detalles = PedidoDetalle.objects.filter(pedido=pedido)

    elements = []
    styles = getSampleStyleSheet()

    # =================================================================
    #                           COLORES
    # =================================================================
    COLOR_NARANJA = colors.HexColor("#FF6A00")
    COLOR_VERDE   = colors.HexColor("#1EBE4E")
    COLOR_AZUL    = colors.HexColor("#1F2B5B")
    COLOR_GRIS    = colors.HexColor("#F3F3F3")

    # =================================================================
    #                           ESTILOS
    # =================================================================
    titulo_style = ParagraphStyle(
        "TituloFactura",
        alignment=1,
        fontSize=22,
        textColor=COLOR_AZUL,
        leading=24,
        spaceAfter=20,
        fontName="Helvetica-Bold",
    )

    encabezado_style = ParagraphStyle(
        "EncabezadoEmpresa",
        alignment=1,
        fontSize=10,
        textColor=colors.black,
        leading=14,
        spaceAfter=0,
    )

    texto_normal = ParagraphStyle("TextoNormal", fontSize=10, leading=14)
    texto_bold   = ParagraphStyle("TextoBold", fontSize=10, leading=14, fontName="Helvetica-Bold")

    # =================================================================
    #             ENCABEZADO ESTÁTICO + LOGO (MEJORADO)
    # =================================================================

    # Línea decorativa superior
    elements.append(
        Table(
            [[""]],
            colWidths=[520],
            style=[
                ("BACKGROUND", (0, 0), (-1, -1), COLOR_NARANJA),
                ("LINEBELOW", (0, 0), (-1, -1), 2, COLOR_VERDE),
            ],
        )
    )
    elements.append(Spacer(1, 10))

    encabezado_texto = """
        <b>EL GUSTADOR</b><br/>
        María Osnid Díaz Castillo<br/>
        NIT. 00000000000000<br/>
        Responsable de IVA<br/>
        Carrera 5 #145-75<br/>
        Ibagué - Tolima<br/>
        Tel: 3101010101<br/>
    """

    # Logo
    logo_path = os.path.join(settings.BASE_DIR, "media/empresa/logo.png")
    if os.path.exists(logo_path):
        logo_img = Image(logo_path, width=120, height=120)
    else:
        logo_img = Paragraph("", texto_normal)

    encabezado_tabla = Table(
        [
            [
                logo_img,
                Paragraph(encabezado_texto, encabezado_style),
            ]
        ],
        colWidths=[160, 360],   # 💡 Más balanceado
    )

    encabezado_tabla.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (0, 0), "CENTER"),
                ("ALIGN", (1, 0), (1, 0), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )

    elements.append(encabezado_tabla)
    elements.append(Spacer(1, 20))

    # =================================================================
    #                           TÍTULO
    # =================================================================
    elements.append(Paragraph("Factura Electrónica", titulo_style))
    elements.append(Spacer(1, 14))

    # =================================================================
    #         INFORMACIÓN CLIENTE + INFORMACIÓN FACTURA
    # =================================================================

    info_cliente = f"""
        <b>INFORMACIÓN DEL CLIENTE</b><br/><br/>
        <b>Nombre:</b> {pedido.usuario.nombre}<br/>
        <b>Documento:</b> {pedido.usuario.identificacion}<br/>
        <b>Email:</b> {pedido.usuario.email}<br/>
        <b>Dirección:</b> {pedido.municipio.nombre} - {pedido.departamento.nombre} - {pedido.direccion_detallada}<br/>
    """

    info_factura = f"""
        <b>Factura #:</b> {factura.id}<br/>
        <b>Fecha:</b> {factura.fecha.strftime('%Y-%m-%d %H:%M')}<br/>
        <b>Estado Pedido:</b> {pedido.estado}<br/>
        <b>Pago:</b> Confirmado<br/>
    """

    tabla_info = Table(
        [[Paragraph(info_cliente, texto_normal),
          Paragraph(info_factura, texto_normal)]],
        colWidths=[260, 260]
    )

    tabla_info.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ])
    )

    elements.append(tabla_info)
    elements.append(Spacer(1, 20))

    # =================================================================
    #                        TABLA PRODUCTOS
    # =================================================================
    table_data = [["ARTÍCULO", "CANT", "PRECIO", "SUBTOTAL"]]

    for item in detalles:
        table_data.append([
            item.producto.nombre,
            str(item.cantidad),
            f"${item.precio_unitario:,.0f}",
            f"${item.precio_total:,.0f}",
        ])

    tabla_productos = Table(table_data, colWidths=[260, 80, 90, 90])

    tabla_productos.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), COLOR_NARANJA),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.3, colors.grey),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, COLOR_GRIS]),
            ("ALIGN", (1, 1), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ])
    )

    elements.append(tabla_productos)
    elements.append(Spacer(1, 20))

    # =================================================================
    #                             TOTALES
    # =================================================================
    total_items = sum(item.precio_total for item in detalles)

    tabla_totales = Table([
        ["Subtotal:", f"${total_items:,.0f}"],
        ["Envío:", f"${pedido.costo_envio:,.0f}"],
        ["TOTAL:", f"${factura.total:,.0f}"],
    ], colWidths=[400, 120])

    tabla_totales.setStyle(
        TableStyle([
            ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
            ("FONTNAME", (0, 2), (-1, 2), "Helvetica-Bold"),
            ("TEXTCOLOR", (0, 2), (-1, 2), COLOR_VERDE),
            ("FONTSIZE", (0, 0), (-1, -1), 11),
        ])
    )

    elements.append(tabla_totales)
    elements.append(Spacer(1, 25))

    # =================================================================
    #                           PIE DE PÁGINA (MEJORADO)
    # =================================================================

    footer_line = Table(
        [[""]],
        colWidths=[520],
        style=[("LINEABOVE", (0, 0), (-1, -1), 1.2, COLOR_VERDE)]
    )
    elements.append(footer_line)
    elements.append(Spacer(1, 6))

    footer_text = """
        <para align='center'>
            <font color='#1EBE4E'><b>Gracias por tu compra</b></font><br/>
            <font color='#FF6A00'>www.elgustador.com</font>
        </para>
    """

    elements.append(
        Paragraph(footer_text, ParagraphStyle("footer", alignment=1, fontSize=11))
    )

    pdf.build(elements)
    buffer.seek(0)
    return buffer

# =================================================================
#                      VIEWSET PRINCIPAL
# =================================================================
class FacturaViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FacturaSerializer

    def get_queryset(self):
        # admin → todas
        if self.request.user.rol == "administrador":
            return Factura.objects.all()

        # otros → solo sus facturas
        return Factura.objects.filter(pedido__usuario=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        factura = serializer.save()
        return Response(self.get_serializer(factura).data, status=201)


# =================================================================
#                      LISTADOS
# =================================================================
class FacturasUsuarioView(generics.ListAPIView):
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Factura.objects.filter(pedido__usuario=self.request.user)


class FacturasAdminView(generics.ListAPIView):
    serializer_class = FacturaSerializer
    permission_classes = [IsAuthenticated, IsAdministrador]

    def get_queryset(self):
        return Factura.objects.all()


# =================================================================
#                     DESCARGAR FACTURA PDF
# =================================================================
class DescargarFacturaPDF(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, factura_id):
        try:
            factura = Factura.objects.get(id=factura_id)
        except Factura.DoesNotExist:
            return Response({"detail": "Factura no encontrada"}, status=404)

        # Seguridad
        if factura.pedido.usuario != request.user and request.user.rol != "administrador":
            return Response({"detail": "No tienes permiso"}, status=403)

        pdf_buffer = generar_pdf_factura(factura)

        return FileResponse(pdf_buffer, as_attachment=True, filename=f"factura_{factura.id}.pdf")


# =================================================================
#                     ENVIAR POR EMAIL
# =================================================================
class EnviarFacturaEmail(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, factura_id):
        try:
            factura = Factura.objects.get(id=factura_id)
        except Factura.DoesNotExist:
            return Response({"detail": "Factura no encontrada"}, status=404)

        # Seguridad
        if factura.pedido.usuario != request.user and request.user.rol != "administrador":
            return Response({"detail": "No tienes permiso"}, status=403)

        # Generar PDF
        pdf_buffer = generar_pdf_factura(factura)
        pdf_bytes = pdf_buffer.getvalue()

        if not pdf_bytes or len(pdf_bytes) < 100:
            return Response({"detail": "Error generando el PDF"}, status=500)

        # ----------------------------------------------------------
        #                PLANTILLA DE CORREO (HTML)
        # ----------------------------------------------------------
        html_body = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color:#333;">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color:#1F2B5B; margin-bottom: 5px;">Factura Electrónica de Venta</h2>
                <p style="font-size: 14px; color:#555;">
                    Gracias por tu compra. Adjuntamos la factura correspondiente a tu pedido.
                </p>
            </div>

            <div style="background:#F9F9F9; padding: 15px; border-radius: 8px; border-left:5px solid #FF6A00;">
                <p><strong style="color:#1EBE4E;">Factura N.º:</strong> {factura.id}</p>
                <p><strong style="color:#1EBE4E;">Fecha:</strong> {factura.fecha.strftime('%Y-%m-%d %H:%M')}</p>
                <p><strong style="color:#1EBE4E;">Cliente:</strong> {factura.pedido.usuario.nombre}</p>
            </div>

            <p style="margin-top: 25px; line-height: 1.6;">
                Hemos generado tu factura en formato PDF.  
                Puedes descargarla en el archivo adjunto.
            </p>

            <hr style="border: none; border-top: 1px solid #EEE; margin: 30px 0;">

            <p style="text-align: center; font-size: 12px; color:#777;">
                © {timezone.now().year} El Gustador ·  
                <a href="https://elgustador.com" style="color:#FF6A00; text-decoration:none;">
                    elgustador.com
                </a><br>
                Gracias por confiar en nosotros.
            </p>
        </div>
        """

        # ----------------------------------------------------------
        #                      ENVÍO DEL CORREO
        # ----------------------------------------------------------
        email = EmailMessage(
            subject=f"Factura Electrónica de Venta #{factura.id}",
            body=html_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[factura.pedido.usuario.email],
        )

        # enviar como HTML
        email.content_subtype = "html"

        # Adjuntar PDF
        email.attach(
            f"factura_{factura.id}.pdf",
            pdf_bytes,
            "application/pdf"
        )

        email.send()

        return Response({"detail": "Factura enviada correctamente al correo"}, status=200)
