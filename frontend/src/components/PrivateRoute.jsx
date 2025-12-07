import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * PrivateRoute: Valida acceso según rol
 * 
 * Props:
 * - component: Componente que quieres renderizar si tiene permiso
 * - roles: Array de roles permitidos ['admin', 'empleado', 'cliente']
 */
export default function PrivateRoute({ component: Component, roles }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // No está logeado
    return <Navigate to="/login" />;
  }

  if (!roles.includes(user.rol)) {
    // Rol no permitido, redirige a su dashboard correspondiente
    const dashboard = user.rol === "admin" ? "/admin/dashboard" :
                      user.rol === "empleado" ? "/employee/dashboard" :
                      "/dashboard"; // cliente
    return <Navigate to={dashboard} />;
  }

  // Usuario logeado y con rol permitido
  return <Component />;
}
