// src/components/common/CarritoItem.jsx
import { useState, useRef } from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import AnimacionCantidad from "./AnimacionCantidad";
import { showConfirm } from "../feedback/SweetAlert";


export default function CarritoItem({ item, onCantidad, onDelete }) {
  const theme = useTheme();
  const [animacion, setAnimacion] = useState(null);

  // referencias para la animación desde el botón presionado
  const addBtnRef = useRef(null);
  const minusBtnRef = useRef(null);

  // -----------------------------
  // BURBUJA desde el botón origen
  // -----------------------------
  const spawnBubble = (originEl, tipo) => {
    if (!originEl) return;

    const rect = originEl.getBoundingClientRect();
    const bubble = document.createElement("div");

    bubble.style.position = "fixed";
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top + rect.height / 2}px`;
    bubble.style.width = "14px";
    bubble.style.height = "14px";
    bubble.style.borderRadius = "50%";
    bubble.style.zIndex = "9999";
    bubble.style.opacity = "1";
    bubble.style.transform = "translateY(0)";
    bubble.style.transition =
      "transform 600ms cubic-bezier(.2,.8,.2,1), opacity 600ms linear";

    bubble.style.background =
      tipo === "sumar"
        ? theme.palette.success.main
        : theme.palette.secondary.main;

    document.body.appendChild(bubble);

    requestAnimationFrame(() => {
      bubble.style.transform = "translateY(-60px) scale(1.2)";
      bubble.style.opacity = "0";
    });

    setTimeout(() => bubble.remove(), 620);
  };

  // -----------------------------
  // CAMBIAR CANTIDAD
  // -----------------------------
  const cambiarCantidad = (nuevaCantidad, btnType) => {
    if (nuevaCantidad > item.producto.stock) return;
    if (nuevaCantidad < 1) return;

    const tipo = nuevaCantidad > item.cantidad ? "sumar" : "restar";
    setAnimacion(tipo);
    setTimeout(() => setAnimacion(null), 600);

    // animación desde el botón
    if (btnType === "add") spawnBubble(addBtnRef.current, tipo);
    if (btnType === "minus") spawnBubble(minusBtnRef.current, tipo);

    // actualización estable → NO reordena la lista
    onCantidad(item, nuevaCantidad);
  };

  return (
    <Box
      p={2}
      borderRadius={3}
      boxShadow={3}
      display="flex"
      gap={3}
      mb={3}
      alignItems="center"
      position="relative"
      sx={{
        backgroundColor: theme.palette.background.paper,
        transition: "0.2s ease",
      }}
    >
      {/* Imagen */}
      <img
        src={item.producto.imagen1}
        alt={item.producto.nombre}
        style={{
          width: 90,
          height: 90,
          borderRadius: 10,
          objectFit: "cover",
          boxShadow: theme.shadows[3],
        }}
      />

      {/* Información */}
      <Box flex={1}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          {item.producto.nombre}
        </Typography>

        <Typography color="text.secondary">
          Precio: <b>${item.producto.precio}</b>
        </Typography>

        <Typography color="text.secondary">
          Stock disponible: {item.producto.stock}
        </Typography>

        {/* Controles */}
        <Box display="flex" alignItems="center" mt={2} gap={2}>
          <IconButton
            ref={minusBtnRef}
            onClick={() => cambiarCantidad(item.cantidad - 1, "minus")}
            size="small"
            sx={{
              bgcolor: theme.palette.secondary.main,
              color: "#fff",
              "&:hover": {
                bgcolor: theme.palette.secondary.dark,
              },
            }}
          >
            <Remove />
          </IconButton>

          <Typography fontSize={18} fontWeight={600}>
            {item.cantidad}
          </Typography>

          <IconButton
            ref={addBtnRef}
            onClick={() => cambiarCantidad(item.cantidad + 1, "add")}
            size="small"
            sx={{
              bgcolor: theme.palette.success.main,
              color: "#fff",
              "&:hover": {
                bgcolor: theme.palette.success.dark,
              },
            }}
          >
            <Add />
          </IconButton>

          <IconButton
            color="error"
            sx={{ marginLeft: "auto" }}
            onClick={async () => {
              const confirmed = await showConfirm(
                "¿Eliminar producto?",
                "Este producto será eliminado del carrito."
              );

              if (confirmed) {
                onDelete(item.id);
              }
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>

    </Box>
  );
}
