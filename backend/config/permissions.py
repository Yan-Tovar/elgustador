from rest_framework import permissions

class IsCliente(permissions.BasePermission):
    """
    Permite acceso solo a usuarios con rol 'cliente'.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.rol == "cliente")


class IsEmpleado(permissions.BasePermission):
    """
    Permite acceso solo a usuarios con rol 'empleado' o superior.
    Empleado puede hacer lo que un cliente puede.
    """

    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.rol in ["empleado", "admin", "cliente"]  # Empleado hereda permisos de cliente
        )


class IsAdministrador(permissions.BasePermission):
    """
    Permite acceso solo a usuarios con rol 'admin'.
    """
    def has_permission(self, request, view):
        return bool(
            request.user 
            and request.user.is_authenticated 
            and request.user.rol == "admin"  # Solo admin
        )
