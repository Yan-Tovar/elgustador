import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../services/api";
import { addToCarrito } from "../services/carritoService";
import DashboardLayout from "../components/layout/DashboardLayout";

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
      const res = await api.get("productos/");
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

      if (res.data.warning) {
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: "warning",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Producto agregado al carrito",
          severity: "success",
        });
      }

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

  return (
    <DashboardLayout>
      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Productos disponibles
        </Typography>

        <Grid container spacing={2}>
          {productos.map((prod) => (
            <Grid item xs={12} sm={6} md={4} key={prod.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={prod.imagen1 || "https://via.placeholder.com/300"}
                />
                <CardContent>
                  <Typography variant="h6">{prod.nombre}</Typography>
                  <Typography color="text.secondary">${prod.precio}</Typography>
                  <Typography sx={{ mt: 1 }} color="text.secondary">
                    Stock: {prod.stock}
                  </Typography>

                  {/* Input Cantidad */}
                  <TextField
                    type="number"
                    label="Cantidad"
                    size="small"
                    sx={{ mt: 2 }}
                    value={cantidades[prod.id] || 1}
                    onChange={(e) =>
                      handleCantidadChange(prod.id, e.target.value, prod.stock)
                    }
                    inputProps={{ min: 1, max: prod.stock }}
                  />

                  {/* Botón agregar */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleAddToCarrito(prod)}
                  >
                    Añadir al Carrito
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
