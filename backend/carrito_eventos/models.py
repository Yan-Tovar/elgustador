from django.db import models
from usuarios.models import Usuario
from productos.models import Producto

class CarritoEvento(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

    accion = models.CharField(max_length=50)  # agregar, eliminar, cambiar_cantidad
    cantidad = models.IntegerField(default=1)
    fecha = models.DateTimeField(auto_now_add=True)
