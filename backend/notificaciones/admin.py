from django.contrib import admin
from .models import Notificacion

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "titulo", "leido", "fecha")
    search_fields = ("usuario__email", "titulo")
    list_filter = ("leido",)
