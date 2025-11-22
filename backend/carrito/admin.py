from django.contrib import admin
from .models import Carrito

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "actualizado_en")
    search_fields = ("usuario__email",)
    ordering = ("-actualizado_en",)
