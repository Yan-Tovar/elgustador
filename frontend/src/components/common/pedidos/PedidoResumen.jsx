import { Box, Typography, Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PedidoEstadoIcon from "./PedidoEstadoIcon";

export default function PedidoResumen({ pedido }) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  if (!pedido) return null;

  return (
    <Box
      p={3}
      boxShadow={3}
      borderRadius={3}
      position={isLargeScreen ? "sticky" : "static"}
      top={20}
      sx={{
        width: "100%",
        maxWidth: isLargeScreen ? "100%" : "480px",
        mx: isLargeScreen ? 0 : "auto",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* TÍTULO */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <PedidoEstadoIcon estado={pedido.estado} size={40} />
        <Typography variant="h6" fontWeight={700}>
          Resumen del Pedido
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* INFO PRINCIPAL */}
      <Typography>
        <strong>Estado:</strong> {pedido.estado}
      </Typography>

      <Typography>
        <strong>Fecha:</strong>{" "}
        {new Date(pedido.fecha_creacion).toLocaleString()}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* ENVÍO */}
      <Typography>
        <strong>Municipio:</strong> {pedido.municipio.nombre} - {pedido.departamento.nombre}
      </Typography>

      <Typography>
        <strong>Dirección:</strong> {pedido.direccion_detallada}
      </Typography>

      <Typography>
        <strong>Costo de Envío:</strong> ${pedido.costo_envio}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* PAGO */}
      <Typography>
        <strong>Método de Pago:</strong> {pedido.metodo_pago}
      </Typography>

      <Typography variant="h6" mt={1}>
        Total: ${pedido.total}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography>
        <strong>ID del pedido:</strong> {pedido.id}
      </Typography>
    </Box>
  );
}
