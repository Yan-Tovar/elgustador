// services/ofertasService.js
import api from "./api"; // Instancia global de Axios

// ===============================
// Ofertas
// ===============================

// Obtener todas las ofertas
export const fetchOfertas = () => api.get("ofertas/");

// Obtener una oferta por ID
export const fetchOfertaById = (id) => api.get(`ofertas/${id}/`);

// Crear una nueva oferta
export const createOferta = (data) => api.post("ofertas/", data);

// Actualizar una oferta existente
export const updateOferta = (id, data) => api.put(`ofertas/${id}/`, data);

// Eliminar una oferta
export const deleteOferta = (id) => api.delete(`ofertas/${id}/`);
