// src/components/common/CarritoListado.jsx
import { Box, Typography, Grid, Stack } from "@mui/material";
import CarritoItem from "./CarritoItem";

export default function CarritoListado({ carrito, onCantidad, onDelete }) {
  const items = carrito?.items || [];

  // ❌ Carrito vacío
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <Box width="100%">
        {/* 🔵 Barra superior con imagen y mensaje */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            py: 2,
            boxShadow: 2,
            borderRadius: 2,
            mb: 3,
          }}
        >
          {/* Imagen izquierda */}
          <Box
            component="img"
            src="/carritoVacio.png"
            alt="Carrito vacío"
            sx={{
              height: { xs: 40, sm: 50, md: 60 },
              width: "auto",
              objectFit: "contain",
            }}
          />

          {/* Texto centrado */}
          <Typography
            variant="h6"
            fontWeight={700}
            textAlign="center"
            sx={{
              flexGrow: 1,
              color: "text.secondary",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
            }}
          >
            El carrito está vacío
          </Typography>

          {/* Imagen duplicada a la derecha para balance — opcional */}
          <Box
            component="img"
            src="/carritoVacio.png"
            alt="Carrito vacío"
            sx={{
              height: { xs: 40, sm: 50, md: 60 },
              width: "auto",
              objectFit: "contain",
              opacity: 0, // si lo quieres visible cámbialo a 1
            }}
          />
        </Box>
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
