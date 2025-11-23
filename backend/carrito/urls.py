from django.urls import path
from .views import (
    CarritoView,
    CarritoAgregarProducto,
    CarritoActualizarCantidad,
    CarritoEliminarItem,
)

urlpatterns = [
    path("", CarritoView.as_view(), name="carrito-detalle"),
    path("agregar/", CarritoAgregarProducto.as_view(), name="carrito-agregar"),
    path("cambiar-cantidad/<int:item_id>/", CarritoActualizarCantidad.as_view(), name="carrito-cambiar-cantidad"),
    path("eliminar/<int:item_id>/", CarritoEliminarItem.as_view(), name="carrito-eliminar"),
]
