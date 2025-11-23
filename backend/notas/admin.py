from django.contrib import admin
from .models import Nota

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "titulo", "fecha_creacion")
    search_fields = ("titulo", "usuario__email")
    list_filter = ("fecha_creacion",)
