from django.db import models
from usuarios.models import Usuario
from productos.models import Producto

class Carrito(models.Model):
    """
    Representa el carrito de un usuario.
    Cada usuario tiene 1 carrito activo.
    """
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name="carrito")
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def total(self):
        return sum(item.subtotal for item in self.items.all())

    def __str__(self):
        return f"Carrito de {self.usuario.email}"


class CarritoItem(models.Model):
    """
    Productos dentro del carrito.
    """
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.precio_unitario = self.precio_unitario or self.producto.precio
        self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.producto.nombre} x {self.cantidad}"
