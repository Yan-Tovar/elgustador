from rest_framework import viewsets, filters
from .models import Producto, Categoria
from .serializers import ProductoSerializer
from categorias.models import CategoriaSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().select_related("categoria")
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["nombre", "descripcion"]

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
