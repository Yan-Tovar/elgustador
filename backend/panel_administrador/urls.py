# panel_administrador/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Si tienes ViewSets para acciones de admin o widgets, registra aquí:
# router.register(r"acciones", views.AdminAccionViewSet, basename="admin-acciones")
# router.register(r"widgets", views.DashboardWidgetViewSet, basename="admin-widgets")

urlpatterns = [
    path("", include(router.urls)),
    # Endpoint simple para obtener overview / métricas del panel (si implementaste PanelAdminOverview)
    path("overview/", views.PanelAdminOverview.as_view(), name="panel-overview"),
]
