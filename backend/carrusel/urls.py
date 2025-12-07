from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarruselViewSet

router = DefaultRouter()
router.register(r"", CarruselViewSet, basename="carrusel")

urlpatterns = [
    path("", include(router.urls)),
]