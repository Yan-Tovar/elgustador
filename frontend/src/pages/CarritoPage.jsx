// src/pages/CarritoPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Snackbar, Alert } from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import { fetchCarrito, updateCarrito, deleteCarrito } from "../services/carritoService";
import { fetchUsuario } from "../services/usuariosService";

import CarritoListado from "../components/common/CarritoListado";
import CarritoResumen from "../components/common/CarritoResumen";

import TwoColumnInnerLayout from "../components/layout/TwoColumnInnerLayout";

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

  if (!carrito) return <DashboardLayout><Typography>Cargando...</Typography></DashboardLayout>;

  return (
    <DashboardLayout>
      <Box p={1}>

        {/*  Layout reutilizable de dos columnas */}
        <TwoColumnInnerLayout
          left={
            <CarritoListado
              carrito={carrito}
              onCantidad={handleCantidad}
              onDelete={handleDelete}
            />
          }
          right={
            <CarritoResumen
              usuario={usuario}
              carrito={carrito}
              irACheckout={irACheckout}
            />
          }
        />

        {/* Snackbar para alertas */}
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
