// src/components/common/CarritoResumen.jsx
import { Box, Typography, useTheme } from "@mui/material";

export default function CarritoResumen({ usuario, carrito, irACheckout }) {
  const theme = useTheme();

  const items = carrito?.items || [];

  // Calcular subtotal y cantidad total de forma segura
  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.producto.precio) * Number(item.cantidad),
    0
  );

  const cantidadTotal = items.reduce(
    (acc, item) => acc + Number(item.cantidad),
    0
  );

  const envio = Number(usuario?.municipio?.costo_envio || 0);
  const total = subtotal + envio;

  if (cantidadTotal === 0) {
    return null;
  }

  return (
    <Box
      p={3}
      boxShadow={3}
      borderRadius={3}
      position={{ xs: "static", md: "sticky" }}
      top={20}
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" mb={2}>
        Resumen del pedido
      </Typography>

      <Typography>
        <strong>Cliente:</strong> {usuario?.nombre}
      </Typography>

      <Typography>
        <strong>Dirección:</strong> {usuario?.direccion_detallada}
      </Typography>

      <Typography>
        <strong>Municipio:</strong>{" "}
        {usuario?.municipio?.nombre + " - " + usuario?.departamento?.nombre}
      </Typography>

      <Box mt={2}>
        <Typography>
          <strong>Items totales:</strong> {cantidadTotal}
        </Typography>

        <Typography>Subtotal: ${subtotal}</Typography>
        <Typography>Envío: ${envio}</Typography>

        <Typography variant="h6" mt={1}>
          Total: ${total}
        </Typography>
      </Box>

      <button
        style={{
          width: "100%",
          marginTop: 20,
          padding: 12,
          background: "orangered",
          color: "white",
          border: 0,
          borderRadius: 8,
        }}
        onClick={irACheckout}
      >
        Continuar al pago
      </button>
    </Box>
  );
}
