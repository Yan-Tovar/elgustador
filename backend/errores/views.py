from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import ErrorRegistro
from .serializers import ErrorSerializer

class ErrorLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ErrorRegistro.objects.all()
    serializer_class = ErrorSerializer
    permission_classes = [IsAdminUser]
