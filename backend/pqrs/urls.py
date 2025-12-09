from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PQRSViewSet, ActualizarEstadoPQRSView

router = DefaultRouter()
router.register(r"", PQRSViewSet, basename="pqrs")

urlpatterns = [
    path("", include(router.urls)),
    path("<int:pk>/estado/", ActualizarEstadoPQRSView.as_view(), name="pqrs-actualizar-estado"),
]