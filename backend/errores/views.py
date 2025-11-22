from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import ErrorLog
from .serializers import ErrorLogSerializer

class ErrorLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ErrorLog.objects.all()
    serializer_class = ErrorLogSerializer
    permission_classes = [IsAdminUser]
