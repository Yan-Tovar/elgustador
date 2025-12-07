from django.urls import path, include
from rest_framework.routers import DefaultRouter
# analisis/urls.py
from django.urls import path
from .views import AnalisisView

urlpatterns = [
    path("dashboard/", AnalisisView.as_view(), name="analisis-dashboard"),
]
