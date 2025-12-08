import api from "./api";

// Listar categorías (público + autenticados)
export const fetchCategorias = () => api.get("categorias/");

// Obtener detalle de una categoría
export const fetchCategoria = (categoriaId) => api.get(`categorias/${categoriaId}/`);

// Crear categoría (solo admin)
export const createCategoria = (data) => api.post("categorias/", data);

// Actualizar categoría (solo admin)
export const updateCategoria = (categoriaId, data) => api.put(`categorias/${categoriaId}/`, data);

// Desactivar categoría (solo admin)
export const deleteCategoria = (categoriaId) => api.delete(`categorias/${categoriaId}/`);

// Variable de urls para iamgenes de categorias
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getImagenUrl = (img) => {
  if (!img) return "/default_categoria.png";
  if (img.startsWith("http")) return img;
  return `${API_BASE_URL}${img}`;
};
