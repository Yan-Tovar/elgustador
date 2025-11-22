from django.contrib import admin
from .models import CarritoEvento

@admin.register(CarritoEvento)
class CarritoEventoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "producto", "accion", "cantidad", "fecha")
    search_fields = ("usuario__email", "producto__nombre")
    list_filter = ("accion", "fecha")
