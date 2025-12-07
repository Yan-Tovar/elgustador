// services/DepartamentoService.js
import api from "./api"; // Usa la instancia global con baseURL + token automático

// Obtener todos los departamentos
export const getDepartamentos = () => api.get("departamentos/");

// Crear nuevo departamento
export const createDepartamento = (data) => api.post("departamentos/", data);

// Actualizar departamento
export const updateDepartamento = (id, data) =>
  api.put(`departamentos/${id}/`, data);

// Eliminar departamento
export const deleteDepartamento = (id) =>
  api.delete(`departamentos/${id}/`);

export const buscarDepartamentos = async (filters = {}) => {
  const res = await api.get("/departamentos/departamentos/buscar/", { params: filters });
  return res.data;
};