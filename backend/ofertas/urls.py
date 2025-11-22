from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfertaViewSet

router = DefaultRouter()
router.register(r"", OfertaViewSet, basename="ofertas")

urlpatterns = [
    path("", include(router.urls)),
]