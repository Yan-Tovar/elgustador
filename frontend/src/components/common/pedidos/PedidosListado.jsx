// src/components/pedidos/PedidosListado.jsx
import { Box, Typography, Grid } from "@mui/material";
import PedidoCard from "./PedidoCard";

export default function PedidosListado({ pedidos }) {
  if (!pedidos || pedidos.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="text.secondary">
          No tienes pedidos registrados aún.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {pedidos.map((pedido) => (
        <Grid item xs={12} sm={6} md={4} key={pedido.id}>
          <PedidoCard pedido={pedido} />
        </Grid>
      ))}
    </Grid>
  );
}
