import api from "./api";

// Listar todos los productos (catálogo público)
export const fetchProductos = () => api.get("productos/");

// Buscar productos
export const searchProductos = (query) => api.get(`productos/?search=${query}`);

// Obtener detalle de un producto
export const fetchProducto = (productoId) => api.get(`productos/${productoId}/`);

// Crear producto (solo admin)
export const createProducto = (data) => api.post("productos/", data);

// Actualizar producto (solo admin)
export const updateProducto = (productoId, data) => api.put(`productos/${productoId}/`, data);

// Desactivar producto (solo admin)
export const deleteProducto = (productoId) => api.delete(`productos/${productoId}/`);
