from django.contrib import admin
from .models import Oferta

@admin.register(Oferta)
class OfertaAdmin(admin.ModelAdmin):
    list_display = ("id", "producto", "nombre", "descuento_porcentaje", "estado", "fecha_inicio", "fecha_fin")
    search_fields = ("nombre", "producto__nombre")
    list_filter = ("estado", "fecha_inicio", "fecha_fin")
