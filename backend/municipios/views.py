# municipios/views.py
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from .models import Municipio
from .serializers import MunicipioSerializer
from config.permissions import IsAdministrador

class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all().select_related("departamento")
    serializer_class = MunicipioSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'buscar']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated, IsAdministrador]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        
        if user.is_authenticated and user.rol == "admin":
            return Municipio.objects.all().select_related("departamento")
        
        return Municipio.objects.filter(estado=True).select_related("departamento")

    # Eliminar = desactivar
    def destroy(self, request, *args, **kwargs):
        municipio = self.get_object()
        municipio.estado = False
        municipio.save()
        return Response({"detail": "Municipio desactivado."}, status=status.HTTP_200_OK)

    # ---------------------------
    #  BUSCAR MUNICIPIOS
    # ---------------------------
    @action(detail=False, methods=["get"], url_path="buscar")
    def buscar(self, request):
        user = request.user
        qs = self.get_queryset()

        municipio_id = request.GET.get("id")
        nombre = request.GET.get("nombre")
        departamento_id = request.GET.get("departamento_id")

        # Si no hay filtros → regresar todos
        if not municipio_id and not nombre and not departamento_id:
            serializer = MunicipioSerializer(qs, many=True)
            return Response(serializer.data)

        if municipio_id:
            qs = qs.filter(id=municipio_id)

        if nombre:
            qs = qs.filter(nombre__icontains=nombre)

        if departamento_id:
            qs = qs.filter(departamento_id=departamento_id)

        serializer = MunicipioSerializer(qs, many=True)
        return Response(serializer.data)
