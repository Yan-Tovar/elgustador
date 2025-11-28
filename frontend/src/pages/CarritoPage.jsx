// src/pages/CarritoPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Snackbar, Alert } from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import { fetchCarrito, updateCarrito, deleteCarrito } from "../services/carritoService";
import { fetchUsuario } from "../services/usuariosService";

import CarritoListado from "../components/common/CarritoListado";
import CarritoResumen from "../components/common/CarritoResumen";
import { WidthFull } from "@mui/icons-material";

export default function CarritoPage() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const loadCarrito = async () => {
    const res = await fetchCarrito();
    setCarrito(res.data);
  };

  const loadUsuario = async () => {
    const res = await fetchUsuario();
    setUsuario(res.data);
  };

  useEffect(() => {
    loadCarrito();
    loadUsuario();
  }, []);

  const handleCantidad = async (item, qty) => {
    try {
      const res = await updateCarrito(item.id, { cantidad: qty });

      if (res.data.warning) {
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: "warning",
        });
      }

      loadCarrito();
    } catch (error) {}
  };

  const handleDelete = async (itemId) => {
    await deleteCarrito(itemId);
    loadCarrito();
  };

  const irACheckout = () => navigate("/checkout");

  if (!carrito) return <Typography>Cargando...</Typography>;

  return (
    <DashboardLayout>
      <Box p={1}>
        <Grid container spacing={3}>
          {/* IZQUIERDA → listado */}
          <Grid item xs={12} md={8}>
            <CarritoListado
              carrito={carrito}
              onCantidad={handleCantidad}
              onDelete={handleDelete}
            />
          </Grid>

          {/* DERECHA → resumen */}
          <Grid item xs={12} md={4}>
            <CarritoResumen
              usuario={usuario}
              carrito={carrito}
              irACheckout={irACheckout}
            />
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
