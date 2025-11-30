// servicios/usuariosService.js
import api from "./api";

// Obtener datos del usuario autenticado
export const fetchUsuario = () => api.get("usuarios/usuarios/me/");

// Editar datos del usuario autenticado
export const updateUsuario = (data) => api.put("usuarios/usuarios/me/", data);
