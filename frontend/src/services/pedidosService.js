import api from "./api";

// ------------------------------------------
// PEDIDOS DEL USUARIO (paginado + filtros)
// ------------------------------------------
export const fetchPedidosUsuario = async (params = {}) => {
  // params puede incluir: estado, search, page, page_size
  const response = await api.get("pedidos/usuario/", { params });
  return response.data;  // incluye paginación: count, next, previous, results
};

// ------------------------------------------
// TODOS LOS PEDIDOS (ADMIN) PAGINADOS
// ------------------------------------------
export const fetchPedidosTodos = async (params = {}) => {
  const response = await api.get("pedidos/admin/", { params });
  return response.data;
};

// ------------------------------------------
// PEDIDOS EMPLEADOS PAGINADOS
// ------------------------------------------
export const fetchPedidosEmpleados = async (params = {}) => {
  const response = await api.get("pedidos/empleado/", { params });
  return response.data;
};

// ------------------------------------------
// CREAR PEDIDO DESDE CARRITO
// ------------------------------------------
export const crearPedidoDesdeCarrito = () =>
  api.post("pedidos/crear-desde-carrito/");

// ------------------------------------------
// OBTENER PEDIDO ESPECÍFICO
// ------------------------------------------
export const getPedido = (id) => api.get(`pedidos/pedidos/${id}/`);

// ------------------------------------------
// DETALLES DEL PEDIDO
// ------------------------------------------
export const fetchPedidoDetalle = async (id) => {
  const response = await api.get(`pedidos/detalles/?pedido=${id}`);
  return response.data;
};

// ------------------------------------------
// ACTUALIZAR ESTADO DE PEDIDO
// ------------------------------------------
export const actualizarEstadoPedido = async (id, nuevoEstado) => {
  return await api.patch(`pedidos/pedido/${id}/actualizar/`, { estado: nuevoEstado });
};

// ------------------------------------------
// ESTADÍSTICAS
// ------------------------------------------
export const fetchPedidosStats = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const response = await api.get("pedidos/stats/", { params });
  return response.data?.data ?? [];
};
