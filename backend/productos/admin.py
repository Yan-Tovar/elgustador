from django.contrib import admin
from .models import Producto

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ("id", "codigo", "nombre", "categoria", "precio", "stock", "estado")
    search_fields = ("codigo", "nombre", "marca")
    list_filter = ("categoria", "estado")
    ordering = ("-id",)
