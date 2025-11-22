import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from departamentos.models import Departamento

@pytest.mark.django_db
def test_crear_departamento():
    client = APIClient()
    url = reverse("departamentos-list")

    data = {
        "nombre": "Antioquia",
        "estado": True
    }

    response = client.post(url, data, format="json")

    assert response.status_code == 201
    assert Departamento.objects.count() == 1
    assert Departamento.objects.first().nombre == "Antioquia"


@pytest.mark.django_db
def test_listar_departamentos():
    Departamento.objects.create(nombre="Antioquia", estado=True)
    Departamento.objects.create(nombre="Cundinamarca", estado=True)

    client = APIClient()
    url = reverse("departamentos-list")

    response = client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2


@pytest.mark.django_db
def test_actualizar_departamento():
    departamento = Departamento.objects.create(nombre="Antioquia", estado=True)

    client = APIClient()
    url = reverse("departamentos-detail", args=[departamento.id])

    data = {
        "nombre": "Antioquia Modificado",
        "estado": False
    }

    response = client.put(url, data, format="json")

    assert response.status_code == 200

    departamento.refresh_from_db()
    assert departamento.nombre == "Antioquia Modificado"
    assert departamento.estado is False


@pytest.mark.django_db
def test_eliminar_departamento():
    departamento = Departamento.objects.create(nombre="Antioquia", estado=True)

    client = APIClient()
    url = reverse("departamentos-detail", args=[departamento.id])

    response = client.delete(url)

    assert response.status_code == 204
    assert Departamento.objects.count() == 0
