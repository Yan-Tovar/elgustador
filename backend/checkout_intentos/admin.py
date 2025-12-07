from django.contrib import admin
from .models import CheckoutIntento

@admin.register(CheckoutIntento)
class CheckoutIntentoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "pedido_id", "metodo_pago", "monto", "estado", "creado_en")
    search_fields = ("usuario__email", "pedido_id")
    list_filter = ("estado", "metodo_pago", "creado_en")
    ordering = ("-creado_en",)
