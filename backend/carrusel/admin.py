from django.contrib import admin
from .models import Carrusel

@admin.register(Carrusel)
class CarruselItemAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "orden", "estado")
    search_fields = ("titulo",)
    list_filter = ("estado",)
    ordering = ("orden",)
