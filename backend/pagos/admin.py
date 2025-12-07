# pagos/admin.py
from django.contrib import admin
from .models import Pago

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ("id", "pedido", "pasarela", "monto", "estado", "transaccion_id", "fecha")
    list_filter = ("pasarela", "estado", "fecha")
    search_fields = ("transaccion_id", "pedido__id", "pedido__usuario__email")
