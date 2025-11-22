from django.contrib import admin
from .models import ReporteAnalisis

@admin.register(ReporteAnalisis)
class ReporteAnalisisAdmin(admin.ModelAdmin):
    list_display = ("id", "tipo", "creado_en")
    search_fields = ("tipo",)
    list_filter = ("tipo", "creado_en")
    ordering = ("-creado_en",)
