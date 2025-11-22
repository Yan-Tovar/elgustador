from django.contrib import admin
from .models import ErrorRegistro

@admin.register(ErrorRegistro)
class ErrorRegistroAdmin(admin.ModelAdmin):
    list_display = ("id", "nivel", "mensaje", "creado_en", "resuelto")
    search_fields = ("mensaje", "usuario__email")
    list_filter = ("nivel", "resuelto")
    ordering = ("-creado_en",)
