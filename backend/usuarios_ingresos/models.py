from django.db import models
from usuarios.models import Usuario

class UsuarioIngreso(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    tipo = models.CharField(max_length=50)
    fecha = models.DateTimeField()
    ip = models.CharField(max_length=50)
