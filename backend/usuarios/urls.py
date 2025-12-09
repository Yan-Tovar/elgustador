# usuarios/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    UsuarioRegistroViewSet,
    LoginViewSet,
    UsuarioAdminViewSet,
    UsuariosPorRolView,
    UsuariosPorMesView,
    UsuariosEnSesionView,
    ExportUsuariosExcelView
)
from .views_logout import LogoutView
from .views_me import UsuarioMeAPIView

router = DefaultRouter()

# -----------------------------
# RUTAS EXISTENTES (NO SE TOCAN)
# -----------------------------
router.register(r"", UsuarioViewSet, basename="usuarios")
router.register(r"registro", UsuarioRegistroViewSet, basename="usuarios-registro")
router.register(r"login", LoginViewSet, basename="usuarios-login")

# -----------------------------
# RUTAS ADMIN (NUEVAS)
# -----------------------------
router.register(
    r"admin/usuarios",
    UsuarioAdminViewSet,
    basename="usuarios-admin"
)

urlpatterns = [
    path("", include(router.urls)),

    # Usuario autenticado
    path("usuarios/me/", UsuarioMeAPIView.as_view(), name="usuario-me"),

    # Logout
    path("logout/", LogoutView.as_view(), name="logout"),

    # Reportes y Estadísticas
    path("admin/estadisticas/usuarios-por-rol/", UsuariosPorRolView.as_view()),
    path("admin/estadisticas/usuarios-por-mes/", UsuariosPorMesView.as_view()),
    path("admin/estadisticas/usuarios-en-sesion/", UsuariosEnSesionView.as_view()),
    path("admin/exportar/usuarios-excel/", ExportUsuariosExcelView.as_view()),
]
