// src/components/common/CarritoListado.jsx
import { Box, Typography, Grid, Stack } from "@mui/material";
import CarritoItem from "./CarritoItem";

export default function CarritoListado({ carrito, onCantidad, onDelete }) {
  const items = carrito?.items || [];

  //  Carrito vacío 
  if (!Array.isArray(items) || items.length === 0) {
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
        {/* Imagen centrada */}
        <Box
          component="img"
          src="/NoCarrito.png"
          alt="Carrito vacío"
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
          Tu carrito está vacío
        </Typography>

        {/* Submensaje opcional */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            maxWidth: "350px",
          }}
        >
          Explora nuestros productos y agrega tus favoritos para continuar con la compra.
        </Typography>
      </Box>
    );
  }

  // Carrito con productos
  return (
    <Box>
      {items.map((item) => (
        <CarritoItem
          key={item.id}
          item={item}
          onCantidad={onCantidad}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
