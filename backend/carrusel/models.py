from django.db import models

class Carrusel(models.Model):
    id = models.BigAutoField(primary_key=True)
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(null=True, blank=True)
    imagen = models.ImageField(upload_to="carrusel/")
    url_destino = models.CharField(max_length=255, null=True, blank=True)
    estado = models.BooleanField(default=True)
    orden = models.IntegerField(default=0)

    def __str__(self):
        return self.titulo