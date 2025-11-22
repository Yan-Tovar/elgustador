from django.contrib import admin
from .models import Factura

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):
    list_display = ("id", "pedido", "numero_factura", "total", "fecha")
    search_fields = ("numero_factura", "pedido__id")
    list_filter = ("fecha",)
