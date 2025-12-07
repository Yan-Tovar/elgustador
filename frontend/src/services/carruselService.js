import api from "./api";

// =========================================
//  LISTADOS
// =========================================

// Cliente / Empleado → lista solo carruseles activos
export const fetchCarruselPublic = () => api.get("carrusel/");

// Administrador → listado paginado
export const fetchCarruselAdmin = (page = 1, pageSize = 10) =>
  api.get(`carrusel/?page=${page}&page_size=${pageSize}`);


// =========================================
//  DETALLE
// =========================================
export const fetchCarrusel = (id) => api.get(`carrusel/${id}/`);


// =========================================
//  CRUD (Solo Admin)
// =========================================
export const createCarrusel = (data) => api.post("carrusel/", data);

export const updateCarrusel = (id, data) =>
  api.put(`carrusel/${id}/`, data);

// Soft delete (estado = false)
export const deleteCarrusel = (id) => api.delete(`carrusel/${id}/`);
