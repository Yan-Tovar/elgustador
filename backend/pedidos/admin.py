from django.contrib import admin
from .models import Pedido
from pedidos_detalles.models import PedidoDetalle

class PedidoDetalleInline(admin.TabularInline):
    model = PedidoDetalle
    extra = 0

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "subtotal", "total", "estado", "fecha_creacion")
    search_fields = ("id", "usuario__email")
    list_filter = ("estado",)
    ordering = ("-fecha_creacion",)
    inlines = [PedidoDetalleInline]
