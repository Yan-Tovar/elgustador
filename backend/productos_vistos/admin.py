from django.contrib import admin
from .models import ProductoVisto

@admin.register(ProductoVisto)
class ProductoVistoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "producto", "fecha", "ip")
    search_fields = ("usuario__email", "producto__nombre")
    list_filter = ("fecha",)
