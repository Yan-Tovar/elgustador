from django.contrib import admin
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "identificacion", "nombre", "apellido", "email", "telefono", "rol", "estado")
    search_fields = ("email", "identificacion", "nombre", "apellido")
    list_filter = ("estado", "rol", "municipio", "departamento")
    ordering = ("-id",)
