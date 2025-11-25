// services/facturasService.js
import api from "./api";

export const crearFactura = (data) => api.post("facturas/", data);

export const getFactura = (id) => api.get(`facturas/${id}/`);

export const getFacturasUsuario = () => api.get("facturas/facturas/usuario/");

export const getFacturasAdmin = () => api.get("facturas/facturas/admin/");
