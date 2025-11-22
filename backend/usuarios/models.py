from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from departamentos.models import Departamento
from municipios.models import Municipio

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("rol", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    identificacion = models.CharField(max_length=20, unique=True, null=True, blank=True)
    nombre = models.CharField(max_length=150)
    apellido = models.CharField(max_length=150)

    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)

    departamento = models.ForeignKey(Departamento, on_delete=models.SET_NULL, null=True, blank=True)
    municipio = models.ForeignKey(Municipio, on_delete=models.SET_NULL, null=True, blank=True)
    direccion_detallada = models.CharField(max_length=255, null=True, blank=True)

    estado = models.BooleanField(default=True)

    ROLES = (
        ("cliente", "Cliente"),
        ("empleado", "Empleado"),
        ("admin", "Administrador"),
    )
    rol = models.CharField(max_length=20, choices=ROLES, default="cliente")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    objects = UsuarioManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nombre", "apellido"]

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
