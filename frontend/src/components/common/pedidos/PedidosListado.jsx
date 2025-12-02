// src/components/pedidos/PedidosListado.jsx
import { Box, Typography, Grid } from "@mui/material";
import PedidoCard from "./PedidoCard";

export default function PedidosListado({ pedidos }) {
  if (!pedidos || pedidos.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        {/* Imagen ilustrativa */}
        <Box
          component="img"
          src="/NoPedidos.png"
          alt="Sin pedidos"
          sx={{
            width: { xs: "60%", sm: "40%", md: "250px" },
            maxWidth: "280px",
            mb: 2,
            objectFit: "contain",
          }}
        />

        {/* Mensaje principal */}
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
            mb: 1,
          }}
        >
          Aún no tienes pedidos
        </Typography>

        {/* Submensaje */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            maxWidth: "350px",
          }}
        >
          Cuando realices un pedido aparecerá aquí para que puedas revisarlo.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontFamily: "fangsong" }}>
        Mis Pedidos
      </Typography>
      <Grid container spacing={3}>
        {pedidos.map((pedido) => (
          <Grid item xs={12} sm={6} md={4} key={pedido.id}>
            <PedidoCard pedido={pedido} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
