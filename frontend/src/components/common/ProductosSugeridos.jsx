// src/components/common/productos/ProductosSugeridos.jsx
import { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { fetchProductos } from "../../services/productosService";
import { addToCarrito } from "../../services/carritoService";

import { CarritoContext } from "../../context/CarritoContext";

import ProductosCard from "../common/ProductosCard";

export default function ProductosSugeridos() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // carrito global
  const { loadCarrito } = useContext(CarritoContext);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const res = await fetchProductos();

      const lista = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setProductos(lista.slice(0, 10));
    } catch (err) {
      console.error("Error cargando productos sugeridos:", err);
    }
  };

  const handleCantidadChange = (productoId, value, stock) => {
    let cantidad = Number(value);
    if (cantidad < 1) cantidad = 1;
    if (cantidad > stock) cantidad = stock;

    setCantidades((prev) => ({
      ...prev,
      [productoId]: cantidad,
    }));
  };

  const handleAddToCarrito = async (producto) => {
    const cantidad = cantidades[producto.id] || 1;

    try {
      const res = await addToCarrito({
        producto_id: producto.id,
        cantidad,
      });

      await loadCarrito();

      setSnackbar({
        open: true,
        message: res.data.warning
          ? res.data.message
          : "Producto agregado al carrito",
        severity: res.data.warning ? "warning" : "success",
      });

      setCantidades((prev) => ({
        ...prev,
        [producto.id]: 1,
      }));
    } catch (err) {
      console.error("Error al agregar:", err);
      setSnackbar({
        open: true,
        message: "Error al agregar al carrito",
        severity: "error",
      });
    }
  };

  const handleDetalle = (producto) => {
    navigate(`/producto/${producto.id}`);
  };

  return (
    <Box mt={4}>
      <Divider sx={{mt: 2, mb: 3, fontSize: 20, }}>¿No estás olvidando algo?</Divider>
      <Grid container spacing={2} justifyContent="center">
        {productos.map((prod) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={2}
            key={prod.id}
            display="flex"
            justifyContent="center"
          >
            <ProductosCard
              producto={prod}
              cantidad={cantidades[prod.id] || 1}
              onCantidadChange={handleCantidadChange}
              onAdd={handleAddToCarrito}
              onDetalle={handleDetalle}
            />
          </Grid>
        ))}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
