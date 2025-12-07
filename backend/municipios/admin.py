from django.contrib import admin
from .models import Municipio


@admin.register(Municipio)
class MunicipioAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "departamento", "costo_envio", "estado")
    search_fields = ("nombre", "departamento__nombre")
    list_filter = ("estado", "departamento")
    ordering = ("departamento", "nombre")

    readonly_fields = ("id",)
