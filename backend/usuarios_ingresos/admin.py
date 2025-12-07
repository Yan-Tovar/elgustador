from django.contrib import admin
from .models import UsuarioIngreso

@admin.register(UsuarioIngreso)
class UsuarioIngresoAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "tipo", "fecha", "ip")
    search_fields = ("usuario__email",)
    list_filter = ("tipo", "fecha")
    ordering = ("-fecha",)
