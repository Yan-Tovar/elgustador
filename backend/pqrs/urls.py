from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PQRSViewSet

router = DefaultRouter()
router.register(r"", PQRSViewSet, basename="pqrs")

urlpatterns = [
    path("", include(router.urls)),
]