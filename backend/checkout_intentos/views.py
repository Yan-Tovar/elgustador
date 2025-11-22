from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import CheckoutIntento
from .serializers import CheckoutIntentoSerializer

class CheckoutIntentoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CheckoutIntento.objects.all()
    serializer_class = CheckoutIntentoSerializer
    permission_classes = [IsAdminUser]
