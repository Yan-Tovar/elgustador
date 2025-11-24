import api from "./api";

export const crearFactura = (data) => api.post("facturas/", data);
export const getFactura = (id) => api.get(`facturas/${id}/`);
