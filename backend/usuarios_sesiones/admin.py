from django.contrib import admin
from .models import UsuarioSesion

@admin.register(UsuarioSesion)
class UsuarioSesionAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "inicio_sesion", "cierre_sesion", "ip")
    search_fields = ("usuario__email", "ip")
    list_filter = ("inicio_sesion",)
    ordering = ("-inicio_sesion",)
