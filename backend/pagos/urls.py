from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PagoViewSet
from .views_simulate import SimulatePagoView

router = DefaultRouter()
router.register(r"", PagoViewSet, basename="pagos")

urlpatterns = [
    path("simulate/", SimulatePagoView.as_view(), name="simulate_pago"),
    path("", include(router.urls)),
]
