// src/servicios/usuariosService.js
import api from "./api";

// Obtener datos del usuario autenticado
export const fetchUsuario = () => api.get("usuarios/usuarios/me/");

// Editar datos del usuario autenticado
export const updateUsuario = (data) => api.put("usuarios/usuarios/me/", data);


export const fetchUsuariosAdmin = ({
  page = 1,
  search = "",
  rol = "",
} = {}) => {
  const params = {};

  if (page) params.page = page;
  if (search) params.search = search;
  if (rol) params.rol = rol;

  return api.get("usuarios/admin/usuarios/", { params });
};

// usuario por id
export const fetchUsuarioByIdAdmin = (id) =>
  api.get(`usuarios/admin/usuarios/${id}/`);

// Actualizacion de usuario desde admin
export const updateUsuarioAdmin = (id, data) =>
  api.patch(`usuarios/admin/usuarios/${id}/`, data);

// ===================================================
// ESTADÍSTICAS ADMIN
// ===================================================

// Usuarios agrupados por rol (para ECharts - barras / pie)
export const fetchUsuariosPorRol = () =>
  api.get("usuarios/admin/estadisticas/usuarios-por-rol/");

// Usuarios registrados por mes (línea / barras)
export const fetchUsuariosPorMes = () =>
  api.get("usuarios/admin/estadisticas/usuarios-por-mes/");

// Usuarios actualmente en sesión
export const fetchUsuariosEnSesion = () =>
  api.get("usuarios/admin/estadisticas/usuarios-en-sesion/");


// ===================================================
// EXPORTACIONES ADMIN
// ===================================================

// Descargar reporte de usuarios en Excel
export const exportUsuariosExcel = () =>
  api.get("usuarios/admin/exportar/usuarios-excel/", {
    responseType: "blob", 
  });
