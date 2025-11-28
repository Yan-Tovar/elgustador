import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import DashboardLayout from "../components/layout/DashboardLayout";

import { fetchProductos } from "../services/productosService";
import { addToCarrito } from "../services/carritoService";

import ProductosCard from "../components/common/ProductosCard";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const res = await fetchProductos();
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
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

      setSnackbar({
        open: true,
        message: res.data.warning ? res.data.message : "Producto agregado al carrito",
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

  // 🔹 Función para el botón "Detalle"
  const handleDetalle = (producto) => {
    console.log("Ver detalle de:", producto);
    // Aquí puedes redirigir a /productos/id
    // navigate(`/productos/${producto.id}`);
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          padding: 1,
          marginLeft: 0,
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="center"
        >
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
