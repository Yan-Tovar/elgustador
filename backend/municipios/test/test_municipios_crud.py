import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from departamentos.models import Departamento
from municipios.models import Municipio

Usuario = get_user_model()

@pytest.fixture
def api():
    user = Usuario.objects.create_user(
        email="admin@test.com",
        password="admin123"
    )
    client = APIClient()
    client.force_authenticate(user=user)   # 🔥 AUTENTICACIÓN FORZADA PARA CRUD
    return client

@pytest.fixture
def departamento():
    return Departamento.objects.create(nombre="Cundinamarca")

@pytest.fixture
def municipio(departamento):
    return Municipio.objects.create(
        nombre="Bogotá",
        departamento=departamento,
        costo_envio=7000,
        estado=True
    )

class TestMunicipiosCRUD:

    # -----------------------
    # CREATE
    # -----------------------
    def test_crear_municipio(self, api, departamento):
        payload = {
            "nombre": "Soacha",
            "departamento_id": departamento.id,
            "costo_envio": 5000,
            "estado": True
        }

        response = api.post("/api/municipios/", payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["nombre"] == "Soacha"

    # -----------------------
    # READ LIST
    # -----------------------
    def test_listar_municipios(self, api, municipio):
        response = api.get("/api/municipios/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

    # -----------------------
    # UPDATE
    # -----------------------
    def test_actualizar_municipio(self, api, municipio, departamento):
        payload = {
            "nombre": "Bogotá Centro",
            "departamento_id": departamento.id,
            "costo_envio": 8000,
            "estado": True
        }

        response = api.put(f"/api/municipios/{municipio.id}/", payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["nombre"] == "Bogotá Centro"

    # -----------------------
    # DELETE
    # -----------------------
    def test_eliminar_municipio(self, api, municipio):
        response = api.delete(f"/api/municipios/{municipio.id}/")
        assert response.status_code == status.HTTP_204_NO_CONTENT
