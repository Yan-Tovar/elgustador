// services/notificacionesService.js
import api from "./api"; // Instancia global de Axios

// ===============================
// Notificaciones
// ===============================

// Obtener todas las notificaciones del usuario
export const fetchNotificaciones = () => api.get("notificaciones/");

// Obtener una notificación por ID
export const fetchNotificacionById = (id) => api.get(`notificaciones/${id}/`);

// Marcar una notificación como leída (update)
export const marcarNotificacionLeida = (id) =>
  api.patch(`notificaciones/${id}/`, { leido: true });

// Crear una notificación manualmente (POR SI LA NECESITAS)
export const createNotificacion = (data) =>
  api.post("notificaciones/", data);

// (No existe delete porque está deshabilitado en el backend)
