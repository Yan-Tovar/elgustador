import axios from "axios";

// 1. Crear instancia de axios con baseURL
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/notas/",
});

// 2. Interceptor: agrega automáticamente el token ANTES de cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====================================================
// 3. Tus funciones, pero usando SOLO "api" y sin config
// ====================================================

// Obtener todas las notas del usuario autenticado
export const fetchNotas = () => api.get("/");

// Crear nota
export const createNota = (data) => api.post("/", data);

// Obtener nota por ID
export const fetchNotaById = (id) => api.get(`/${id}/`);

// Actualizar nota
export const updateNota = (id, data) => api.put(`/${id}/`, data);

// Desactivar nota (soft delete)
export const deleteNota = (id) => api.delete(`/${id}/`);
