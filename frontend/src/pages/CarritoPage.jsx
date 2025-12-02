// src/pages/CarritoPage.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Snackbar, Alert } from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import { updateCarrito, deleteCarrito } from "../services/carritoService";
import { fetchUsuario } from "../services/usuariosService";

import { CarritoContext } from "../context/CarritoContext";

import CarritoListado from "../components/common/CarritoListado";
import CarritoResumen from "../components/common/CarritoResumen";

import TwoColumnInnerLayout from "../components/layout/TwoColumnInnerLayout";

export default function CarritoPage() {
  const navigate = useNavigate();

  //  Traer carrito y loadCarrito del CarritoContext
  const { carrito, loadCarrito } = useContext(CarritoContext);

  const [usuario, setUsuario] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Cargar usuario y carrito al montar
  useEffect(() => {
    loadCarrito();
    loadUsuario();
  }, []);

  const loadUsuario = async () => {
    try {
      const res = await fetchUsuario();
      setUsuario(res.data);
    } catch (err) {
      console.error("Error cargando usuario:", err);
    }
  };

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

      // Actualiza carrito global
      await loadCarrito();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteCarrito(itemId);

      // Actualiza carrito global
      await loadCarrito();
    } catch (error) {
      console.error(error);
    }
  };

  const irACheckout = () => navigate("/checkout");

  if (!carrito)
    return (
      <DashboardLayout>
        <Typography>Cargando...</Typography>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <Box p={1}>
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
