import api from "./api";

export const fetchPedidos = async () => {
  return await api.get("pedidos/");
};

export const crearPedidoDesdeCarrito = () => api.post("pedidos/crear-desde-carrito/");

export const getPedido = (id) => api.get(`pedidos/pedidos/${id}/`);

// Todos los pedidos (para administrador)
export const fetchPedidosTodos = async () => {
  const response = await api.get("pedidos/admin/");
  // Aseguramos que devuelva array
  return Array.isArray(response.data) ? response.data : [];
};

// Pedidos de empleados (todos excepto pendientes)
export const fetchPedidosEmpleados = async () => {
  const response = await api.get("pedidos/empleado/");
  return Array.isArray(response.data) ? response.data : [];
};

// Pedidos del usuario actual (cliente)
export const fetchPedidosUsuario = async () => {
  const response = await api.get("pedidos/usuario/");
  return Array.isArray(response.data) ? response.data : [];
};

// Detalles de un pedido específico
export const fetchPedidoDetalle = async (id) => {
  const response = await api.get(`/pedidos/detalles/?pedido=${id}`);
  return Array.isArray(response.data) ? response.data : [];
};

// Actualizar el estado de un pedido (solo empleados/admins)
export const actualizarEstadoPedido = async (id, nuevoEstado) => {
  const response = await api.patch(`pedidos/pedido/${id}/actualizar/`, { estado: nuevoEstado });
  return response;
};

