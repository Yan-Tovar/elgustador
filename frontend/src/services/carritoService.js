import api from "./api"; 

// Obtener carrito del usuario
export const fetchCarrito = () => api.get("carrito/");

// Agregar producto al carrito
export const addToCarrito = (data) => api.post("carrito/agregar/", data);

// Actualizar cantidad o información de un ítem del carrito
export const updateCarrito = (itemId, data) => api.put(`carrito/cambiar-cantidad/${itemId}/`, data);

// Eliminar un ítem del carrito
export const deleteCarrito = (itemId) => api.delete(`carrito/eliminar/${itemId}/`);
