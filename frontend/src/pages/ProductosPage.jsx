// src/pages/ProductosPage.jsx
import { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from "../components/layout/DashboardLayout";

import { fetchProductos, searchProductos } from "../services/productosService";
import { addToCarrito } from "../services/carritoService";

import { CarritoContext } from "../context/CarritoContext";

import ProductosCard from "../components/common/ProductosCard";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Traer loadCarrito desde el context
  const { loadCarrito } = useContext(CarritoContext);

  // Cargar productos al montar página
  useEffect(() => {
    loadProductos();
  }, []);

  // Debounce búsqueda
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") {
        loadProductos();
      } else {
        handleSearch(search);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const loadProductos = async () => {
    try {
      const res = await fetchProductos();
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  const handleSearch = async (texto) => {
    try {
      const res = await searchProductos(texto);
      setProductos(res.data);
    } catch (err) {
      console.error("Error buscando productos:", err);
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

      // 🚀 Actualiza el carrito global
      await loadCarrito();

      setSnackbar({
        open: true,
        message: res.data.warning
          ? res.data.message
          : "Producto agregado al carrito",
        severity: res.data.warning ? "warning" : "success",
      });

      setCantidades((prev) => ({ ...prev, [producto.id]: 1 }));
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
    console.log("Ver detalle:", producto);
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: 1 }}>
        {/* BARRA DE BÚSQUEDA */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 2,
              maxWidth: 400,
            }}
          />
        </Box>

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
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
