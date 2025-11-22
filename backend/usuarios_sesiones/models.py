from django.db import models
from usuarios.models import Usuario

class UsuarioSesion(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    inicio_sesion = models.DateTimeField()
    cierre_sesion = models.DateTimeField(null=True, blank=True)

    ip = models.CharField(max_length=50)
    user_agent = models.CharField(max_length=255)
