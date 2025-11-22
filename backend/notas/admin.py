from django.contrib import admin
from .models import Nota

@admin.register(Nota)
class NotaAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "producto", "titulo", "fecha_creacion")
    search_fields = ("titulo", "usuario__email", "producto__nombre")
    list_filter = ("fecha_creacion",)
