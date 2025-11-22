from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ErrorLogViewSet

router = DefaultRouter()
router.register(r"", ErrorLogViewSet, basename="errores")

urlpatterns = [
    path("", include(router.urls)),
]