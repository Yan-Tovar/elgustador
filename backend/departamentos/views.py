from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Departamento
from .serializers import DepartamentoSerializer
from config.permissions import IsAdministrador

class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer

    # -----------------------------------------
    # PERMISOS
    # -----------------------------------------
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]  # cualquier usuario puede consultar
        else:
            # solo ADMIN puede crear, actualizar y cambiar estado
            permission_classes = [IsAuthenticated, IsAdministrador]
        return [p() for p in permission_classes]

    # -----------------------------------------
    # LISTAR (filtrar según rol)
    # -----------------------------------------
    def get_queryset(self):
        user = self.request.user

        # Si es admin devuelve todos
        if user.is_authenticated and hasattr(user, "rol") and user.rol == "admin":
            return Departamento.objects.all()

        # Los demás solo ven los activos
        return Departamento.objects.filter(estado=True)

    # -----------------------------------------
    # ELIMINAR = cambiar estado a False
    # -----------------------------------------
    def destroy(self, request, *args, **kwargs):
        departamento = self.get_object()

        # En vez de eliminar → desactivar
        departamento.estado = False
        departamento.save()

        return Response(
            {"detail": "Departamento desactivado correctamente."},
            status=status.HTTP_200_OK
        )

@api_view(["GET"])
def buscar_departamento(request):
    departamento_id = request.GET.get("id")
    nombre = request.GET.get("nombre")
    codigo = request.GET.get("codigo")

    departamentos = Departamento.objects.all()

    if departamento_id:
        departamentos = departamentos.filter(id=departamento_id)

    if nombre:
        departamentos = departamentos.filter(nombre__icontains=nombre)

    if codigo:
        departamentos = departamentos.filter(codigo__iexact=codigo)

    serializer = DepartamentoSerializer(departamentos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)