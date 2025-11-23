// services/notasService.js
import api from "./api"; // Importa la instancia global

// ===============================
// CRUD Notas
// ===============================

// Obtener todas las notas
export const fetchNotas = () => api.get("notas/");

// Crear nota
export const createNota = (data) => api.post("notas/", data);

// Obtener nota por ID
export const fetchNotaById = (id) => api.get(`notas/${id}/`);

// Actualizar nota
export const updateNota = (id, data) => api.put(`notas/${id}/`, data);

// Eliminar (desactivar) nota
export const deleteNota = (id) => api.delete(`notas/${id}/`);
