import api from "./api";

// Listar todos los productos (catálogo público)
export const fetchProductos = () => api.get("productos/gestion/");

// Buscar productos
export const searchProductos = (query) => api.get(`productos/gestion/?search=${query}`);

// Obtener detalle de un producto
export const fetchProducto = (id) => api.get(`productos/gestion/${id}/`);

// Crear producto (solo admin)
export const createProducto = (data) => api.post("productos/gestion/", data);

// Actualizar producto (solo admin)
export const updateProducto = (id, data) => api.put(`productos/gestion/${id}/`, data);

// Desactivar producto (solo admin)
export const deleteProducto = (id) => api.delete(`productos/gestion/${id}/`);

// Buscar productos por categoria
export const fetchProductosPorCategoria = async (categoriaId) => { return await api.get(`/productos/por-categoria/${categoriaId}/`); };

// ESTADISTICAS INVENTARIO (Admin)
export const fetchInventarioEstadisticas = () => 
  api.get("productos/estadisticas/");

// REPORTES INVENTARIO (Admin)
export const fetchInventarioReportes = () => 
  api.get("productos/reportes/");