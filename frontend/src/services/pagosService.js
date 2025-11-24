// services/pagosService.js
import api from "./api";

// Registrar pago real (PayPal): POST /api/pagos/
export const registrarPago = (data) => api.post("pagos/", data);

// Simular pago (botón personalizado): POST /api/pagos/simulate/
export const simulatePago = (data) => api.post("pagos/simulate/", data);

// Obtener pagos del usuario
export const fetchPagos = () => api.get("pagos/");
