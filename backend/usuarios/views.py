from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .models import Usuario
from .serializers import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
    UsuarioLoginSerializer,
    UsuarioUpdateSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().select_related("departamento", "municipio")
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

class UsuarioRegistroViewSet(viewsets.GenericViewSet):
    serializer_class = UsuarioRegistroSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)

class LoginViewSet(viewsets.GenericViewSet):
    serializer_class = UsuarioLoginSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        identificacion = serializer.validated_data["identificacion"]
        password = serializer.validated_data["password"]
        user = authenticate(request, identificacion=identificacion, password=password)
        if not user:
            return Response({"detail": "Credenciales incorrectas"}, status=400)

        tokens = get_tokens_for_user(user)
        return Response({
            "user": UsuarioSerializer(user).data,
            **tokens
        })

class UsuarioSelfViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    # GET /usuarios/usuarios/me/
    def list(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    # PUT /usuarios/usuarios/me/
    def update(self, request):
        usuario = request.user
        serializer = UsuarioUpdateSerializer(
            usuario, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Devolver datos completos con relaciones anidadas
        return Response(UsuarioSerializer(usuario).data, status=status.HTTP_200_OK)