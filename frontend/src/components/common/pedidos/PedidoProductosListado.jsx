import { Box, Typography } from "@mui/material";
import PedidoProductoCard from "./PedidoProductoCard";

export default function PedidoProductosListado({ detalles }) {
  const items = detalles || [];

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <Box
        p={3}
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 2,
        }}
      >
        <img
          src="/carritoVacio.png"
          alt="pedido vacío"
          style={{
            width: "220px",
            opacity: 0.8,
            marginBottom: "20px",
          }}
        />
        <Typography variant="h6" fontWeight={600} color="text.secondary">
          Este pedido no tiene productos.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {items.map((item) => (
        <Box key={item.id} mb={2}>
          <PedidoProductoCard item={item} />
        </Box>
      ))}
    </Box>
  );
}
