import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { crearPedidoDesdeCarrito, getPedido } from "../services/pedidosService";
import { registrarPago, simulatePago } from "../services/pagosService";

import { Box, Button, Typography, Stepper, Step, StepLabel } from "@mui/material";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function CheckoutFlow() {
  const { pedidoId: pedidoParam } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [pedidoId, setPedidoId] = useState(pedidoParam || null);
  const [pedido, setPedido] = useState(null);
  const [loadingPedido, setLoadingPedido] = useState(false);

  // ========================================================
  // PASO 1 — CREAR PEDIDO DESDE EL CARRITO
  // ========================================================
  const crearPedido = async () => {
    try {
      const res = await crearPedidoDesdeCarrito();
      const newPedidoId = res.data.pedido_id;

      setPedidoId(newPedidoId);
      setActiveStep(1);

      cargarPedidoDespues(newPedidoId);
    } catch (err) {
      console.error("Error creando pedido:", err);
      alert("Hubo un error creando el pedido.");
    }
  };

  // ========================================================
  // PASO 2 — CARGAR PEDIDO CON RETRASO
  // ========================================================
  const cargarPedidoDespues = async (id) => {
    setLoadingPedido(true);
    await new Promise((res) => setTimeout(res, 1200));

    try {
      const res = await getPedido(id);
      setPedido(res.data);
      setActiveStep(2);
    } catch (err) {
      console.error("Error cargando pedido:", err);
      alert("Error cargando pedido.");
    }

    setLoadingPedido(false);
  };

  // ========================================================
  // PASO 3A — PROCESAR PAGO REAL (PayPal)
  // ========================================================
  const procesarPagoPaypal = async (details) => {
    try {
      const capture = details.purchase_units[0].payments.captures[0];

      const res = await registrarPago({
        pedido: pedidoId,
        monto: pedido.total,
        estado: capture.status,
        transaccion_id: capture.id,
        pasarela: "paypal",
      });

      navigate(`/factura/${res.data.factura_id}`);
    } catch (err) {
      console.error("Error registrando pago:", err);
      alert("Error procesando el pago.");
    }
  };

  // ========================================================
  // PASO 3B — PROCESAR PAGO SIMULADO
  // ========================================================
  const procesarPagoSimulado = async () => {
    if (!pedido) return alert("No hay pedido cargado.");

    try {
      const res = await simulatePago({
        pedido: pedidoId,
        monto: pedido.total,
      });

      navigate(`/factura/${res.data.factura_id}`);
    } catch (err) {
      console.error("Error simulando pago:", err);
      alert("No se pudo simular el pago.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Checkout
      </Typography>

      {/* STEPPER REDUCIDO A 3 PASOS */}
      <Stepper activeStep={activeStep} sx={{ my: 3 }}>
        <Step><StepLabel>Crear Pedido</StepLabel></Step>
        <Step><StepLabel>Cargando Pedido</StepLabel></Step>
        <Step><StepLabel>Pagar</StepLabel></Step>
      </Stepper>

      {/* PASO 1 — CREAR PEDIDO */}
      {activeStep === 0 && (
        <Button variant="contained" onClick={crearPedido}>
          Crear Pedido
        </Button>
      )}

      {/* PASO 2 — CARGANDO */}
      {activeStep === 1 && (
        <Typography>Cargando información del pedido...</Typography>
      )}

      {/* PASO 3 — PAGO */}
      {activeStep === 2 && pedido && (
        <Box>
          <Typography variant="h6">
            Total a pagar: <strong>${pedido.total}</strong>
          </Typography>

          <Box mt={3}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) =>
                actions.order.create({
                  purchase_units: [
                    { amount: { value: pedido.total.toString() } },
                  ],
                })
              }
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                procesarPagoPaypal(details);
              }}
            />
          </Box>

          {/* Pago simulado */}
          <Button
            sx={{ mt: 3 }}
            variant="outlined"
            color="secondary"
            onClick={procesarPagoSimulado}
          >
            Pagar Simulado
          </Button>
        </Box>
      )}
    </Box>
  );
}
