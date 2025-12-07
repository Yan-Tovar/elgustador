from django.urls import path
from .views import CarritoEventosList

urlpatterns = [
    path("", CarritoEventosList.as_view(), name="carrito-eventos-list"),
]