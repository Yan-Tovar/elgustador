from django.db import models
from usuarios.models import Usuario

class Nota(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    titulo = models.CharField(max_length=255)
    contenido = models.TextField()

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.titulo} ({self.usuario})"
