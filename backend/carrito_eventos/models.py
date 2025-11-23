from django.db import models
from usuarios.models import Usuario
from productos.models import Producto

class CarritoEvento(models.Model):
    ACCIONES = [
        ("agregar", "Agregar producto"),
        ("eliminar", "Eliminar producto"),
        ("cambiar_cantidad", "Cambiar cantidad"),
        ("vaciar", "Vaciar carrito"),
    ]

    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    accion = models.CharField(max_length=50, choices=ACCIONES)
    cantidad = models.IntegerField(default=1)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.email} - {self.accion} - {self.fecha}"
