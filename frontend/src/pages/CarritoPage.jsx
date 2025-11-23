import { useEffect, useState } from "react";
import { fetchCarrito, updateCarrito, deleteCarrito } from "../services/carritoService";
import { Box, Typography, Button, TextField, Card, CardContent, Grid, Snackbar, Alert } from "@mui/material";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function CarritoPage() {
  const [carrito, setCarrito] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const loadCarrito = async () => {
    try {
      const res = await fetchCarrito();
      setCarrito(res.data);
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

  useEffect(() => {
    loadCarrito();
  }, []);

  const handleCantidad = async (item, qty) => {
    const cantidad = Number(qty);
    const stock = item.producto.stock;

    if (cantidad < 1) return;

    try {
      const res = await updateCarrito(item.id, { cantidad });

      if (res.data.warning) {
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: "warning",
        });
      }

      loadCarrito();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (itemId) => {
    await deleteCarrito(itemId);
    loadCarrito();
  };

  if (!carrito) return <Typography>Cargando...</Typography>;

  return (
    <DashboardLayout>
      <Box p={3}>
        <Typography variant="h4" mb={3}>Mi Carrito</Typography>

        {carrito.items.length === 0 ? (
          <Typography>No tienes productos en el carrito</Typography>
        ) : (
          <Grid container spacing={2}>
            {carrito.items.map(item => (
              <Grid item xs={12} md={6} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{item.producto.nombre}</Typography>
                    <Typography>Precio: ${item.producto.precio}</Typography>
                    <Typography color="text.secondary">
                      Stock: {item.producto.stock}
                    </Typography>

                    <Box display="flex" alignItems="center" mt={2} gap={2}>
                      <TextField
                        type="number"
                        size="small"
                        label="Cantidad"
                        value={item.cantidad}
                        onChange={(e) => handleCantidad(item, e.target.value)}
                        sx={{ width: 100 }}
                        inputProps={{
                          min: 1,
                          max: item.producto.stock,
                        }}
                      />

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

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
