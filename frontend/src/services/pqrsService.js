import api from "./api"; // tu instancia de axios

// ===============================
// CRUD PQRS
// ===============================

// Crear PQRS (cualquier usuario)
export const createPqrs = (data) => api.post("pqrs/", data);

// Listar todos los PQRS (solo admin)
export const fetchPqrs = async () => {
  const response = await api.get("pqrs/");
  return response.data;  
};

// Obtener PQRS por ID (solo admin)
export const fetchPqrsById = async (id) => {
  const response = await api.get(`pqrs/${id}/`);
  return response.data;
};

// Actualizar estado de PQRS (solo admin)
export const updatePqrsEstado = async (id, estado) => {
  const response = await api.patch(`pqrs/${id}/estado/`, { estado });
  return response.data;
};
