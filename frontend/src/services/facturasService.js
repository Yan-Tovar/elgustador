import api from "./api";

/**
 * Params accepted:
 *  - page
 *  - page_size
 *  - id
 *  - numero_factura
 *  - q
 *  - fecha_from
 *  - fecha_to
 *  - total_min
 *  - total_max
 */

/* -----------------------------
   CRUD BASE DE FACTURAS
----------------------------- */

// Listar facturas generales
export const getFacturas = (params = {}) =>
  api.get("facturas/", { params });

// Crear factura
export const crearFactura = (data) =>
  api.post("facturas/", data);

// Obtener factura por ID
export const getFactura = (id) =>
  api.get(`facturas/${id}/`);


/* -----------------------------
   ENDPOINTS ESPECÍFICOS
----------------------------- */

// Facturas del usuario autenticado
export const getFacturasUsuario = (params = {}) =>
  api.get("facturas/facturas/usuario/", { params });

// Facturas para administrador (listado normal con paginación)
export const getFacturasAdmin = (params = {}) =>
  api.get("facturas/facturas/admin/", { params });


/* -----------------------------
   BUSCADOR, EXPORTS Y REPORTES ADMIN
----------------------------- */

// Buscador avanzado de facturas para administrador
export const buscarFacturasAdmin = (params = {}) =>
  api.get("facturas/facturas/admin/search/", { params });

// Exportar reporte de facturas a Excel
export const exportarFacturasExcel = (params = {}) =>
  api.get("facturas/facturas/admin/export-excel/", {
    params,
    responseType: "blob",
  });


/* -----------------------------
   ACCIONES SOBRE FACTURA
----------------------------- */

// Descargar PDF
export const descargarFacturaPDF = (id) =>
  api.get(`facturas/${id}/descargar/`, { responseType: "blob" });

// Enviar factura por correo
export const enviarFacturaEmail = (id) =>
  api.post(`facturas/${id}/enviar-email/`);
