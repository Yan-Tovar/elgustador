import api from "./api";

export const fetchPedidos = async () => {
  return await api.get("pedidos/");
};

export const crearPedidoDesdeCarrito = () => api.post("pedidos/crear-desde-carrito/");

export const getPedido = (id) => api.get(`pedidos/pedidos/${id}/`);

