from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Nota
from .serializers import NotaSerializer

class NotaViewSet(viewsets.ModelViewSet):
    serializer_class = NotaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Nota.objects.filter(usuario=self.request.user)
