from django.contrib import admin
from .models import AdminAccion, DashboardWidget

@admin.register(AdminAccion)
class AdminAccionAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "accion", "modelo_obj", "objeto_id", "creado_en")
    search_fields = ("accion", "usuario__email")
    list_filter = ("modelo_obj", "creado_en")
    ordering = ("-creado_en",)

@admin.register(DashboardWidget)
class DashboardWidgetAdmin(admin.ModelAdmin):
    list_display = ("id", "clave", "titulo", "orden", "visible")
    search_fields = ("clave", "titulo")
    list_filter = ("visible",)
    ordering = ("orden",)
