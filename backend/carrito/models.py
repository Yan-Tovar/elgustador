from django.db import models
from usuarios.models import Usuario

class Carrito(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    actualizado_en = models.DateTimeField(auto_now=True)
