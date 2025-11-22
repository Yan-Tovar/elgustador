from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoVistoViewSet

router = DefaultRouter()
router.register(r"", ProductoVistoViewSet, basename="productos-vistos")

urlpatterns = [
    path("", include(router.urls)),
]
