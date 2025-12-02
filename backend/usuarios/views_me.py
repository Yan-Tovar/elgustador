# usuarios/views_me.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import UsuarioSerializer, UsuarioUpdateSerializer

class UsuarioMeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # GET /api/usuarios/me/
    def get(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    # PUT /api/usuarios/me/
    def put(self, request):
        usuario = request.user
        serializer = UsuarioUpdateSerializer(
            usuario, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            UsuarioSerializer(usuario).data,
            status=status.HTTP_200_OK
        )
