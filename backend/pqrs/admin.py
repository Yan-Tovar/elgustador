from django.contrib import admin
from .models import PQRS

@admin.register(PQRS)
class PQRSAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "tipo", "estado", "fecha")
    search_fields = ("usuario__email",)
    list_filter = ("tipo", "estado")
