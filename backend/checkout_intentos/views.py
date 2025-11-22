from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import CheckoutIntento
from .serializers import CheckoutIntentosSerializer

class CheckoutIntentoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CheckoutIntento.objects.all()
    serializer_class = CheckoutIntentosSerializer
    permission_classes = [IsAdminUser]
