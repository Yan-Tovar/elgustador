from django.db import models
from usuarios.models import Usuario

class PQRS(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    tipo = models.CharField(max_length=100)
    descripcion = models.TextField()
    estado = models.CharField(max_length=50)
    fecha = models.DateTimeField(auto_now_add=True)
