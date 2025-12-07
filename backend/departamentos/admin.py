from django.contrib import admin
from .models import Departamento


@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "estado")
    search_fields = ("nombre",)
    list_filter = ("estado",)
    ordering = ("nombre",)

    # Para evitar que usuarios sin permisos editen demasiado
    readonly_fields = ("id",)
