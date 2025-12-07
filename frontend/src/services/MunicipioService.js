// services/MunicipioService.js
import api from "./api"; // instancia global con baseURL + token

// Obtener todos los municipios
export const getMunicipios = () => api.get("municipios/");

// Crear un municipio
export const createMunicipio = (data) => api.post("municipios/", data);

// Actualizar un municipio
export const updateMunicipio = (id, data) =>
  api.put(`municipios/${id}/`, data);

// Eliminar municipio (recuerda: en backend solo desactiva)
export const deleteMunicipio = (id) =>
  api.delete(`municipios/${id}/`);

// Buscar municipios con filtros dinámicos
// filtros aceptados: { id, nombre, departamento_id }
export const buscarMunicipios = async (filters = {}) => {
  const res = await api.get("municipios/buscar/", {
    params: filters,
  });
  return res.data;
};
