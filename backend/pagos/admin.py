from django.contrib import admin
from .models import Pago

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ("id", "pedido", "pasarela", "monto", "estado", "fecha")
    search_fields = ("pedido__id", "transaccion_id")
    list_filter = ("pasarela", "estado")
