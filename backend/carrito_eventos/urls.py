from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarritoEventoViewSet

router = DefaultRouter()
router.register(r"", CarritoEventoViewSet, basename="carrito-eventos")

urlpatterns = [
    path("", include(router.urls)),
]