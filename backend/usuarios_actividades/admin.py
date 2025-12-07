from django.contrib import admin
from .models import UsuarioActividad

@admin.register(UsuarioActividad)
class UsuarioActividadAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "actividad", "fecha")
    search_fields = ("usuario__email", "actividad")
    list_filter = ("fecha",)
    ordering = ("-fecha",)
