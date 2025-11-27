// pages/pedidos/PedidoDetallePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchPedidoDetalle, getPedido } from "../services/pedidosService";

export default function PedidoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedido = async () => {
      try {
        const pedidoResponse = await getPedido(id);
        setPedido(pedidoResponse.data);

        const detallesResponse = await fetchPedidoDetalle(id);
        setDetalles(detallesResponse);
      } catch (error) {
        console.error("Error cargando detalles del pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarPedido();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!pedido) {
    return (
      <DashboardLayout>
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h5">Pedido no encontrado</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
        <Box sx={{ p: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
            Volver
        </Button>

        <Typography variant="h4" sx={{ mb: 2 }}>
            Detalle del Pedido #{pedido.id}
        </Typography>

        <Card sx={{ mb: 3, p: 2 }}>
            <CardContent>
            <Typography variant="h6">Información del Pedido</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><strong>Estado:</strong> {pedido.estado}</Typography>
            <Typography><strong>Fecha:</strong> {new Date(pedido.fecha_creacion).toLocaleString()}</Typography>
            <Typography><strong>Total:</strong> ${pedido.total}</Typography>
            </CardContent>
        </Card>

        <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Productos del Pedido
        </Typography>

        <Grid container spacing={2}>
            {detalles.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card>
                <CardContent>
                    <Typography variant="h6">{item.producto.nombre}</Typography>
                    <Typography><strong>Cantidad:</strong> {item.cantidad}</Typography>
                    <Typography><strong>Precio unitario:</strong> ${item.precio_unitario}</Typography>
                    <Typography><strong>Subtotal:</strong> ${(item.cantidad * item.precio_unitario).toFixed(2)}</Typography>
                </CardContent>
                </Card>
            </Grid>
            ))}
        </Grid>

        {detalles.length === 0 && (
            <Typography sx={{ mt: 3 }}>Este pedido no tiene productos registrados.</Typography>
        )}
        </Box>
    </DashboardLayout>
  );
}
