// services/facturasService.js
import api from "./api";

/**
 * Params accepted:
 *  - page (number) -> page number (1-based)
 *  - page_size (number) -> optional
 *  - id (int)
 *  - numero_factura (string)
 *  - q (string) -> general query
 *  - fecha_from (YYYY-MM-DD)
 *  - fecha_to (YYYY-MM-DD)
 *  - total_min (number)
 *  - total_max (number)
 */
export const getFacturas = (params = {}) => api.get("facturas/", { params });

export const crearFactura = (data) => api.post("facturas/", data);

export const getFactura = (id) => api.get(`facturas/${id}/`);

export const getFacturasUsuario = (params = {}) => api.get("facturas/facturas/usuario/", { params });

export const getFacturasAdmin = (params = {}) => api.get("facturas/facturas/admin/", { params });

export const descargarFacturaPDF = (id) =>
  api.get(`facturas/${id}/descargar/`, { responseType: "blob" });

export const enviarFacturaEmail = (id) =>
  api.post(`facturas/${id}/enviar-email/`);
