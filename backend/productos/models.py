from django.db import models
from categorias.models import Categoria

class Producto(models.Model):
    id = models.BigAutoField(primary_key=True)
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=255)
    marca = models.CharField(max_length=255, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    descripcion = models.TextField(null=True, blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    precio_anterior = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField(default=0)

    imagen1 = models.CharField(max_length=255, null=True, blank=True)
    imagen2 = models.CharField(max_length=255, null=True, blank=True)
    imagen3 = models.CharField(max_length=255, null=True, blank=True)

    color = models.CharField(max_length=100, null=True, blank=True)
    peso = models.CharField(max_length=100, null=True, blank=True)

    datos_nutricionales = models.TextField(null=True, blank=True)
    ingredientes = models.TextField(null=True, blank=True)
    instrucciones_uso = models.TextField(null=True, blank=True)

    estado = models.BooleanField(default=True)

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre
