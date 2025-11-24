import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import DashboardLayout from "../components/layout/DashboardLayout";
import { fetchPedidos } from "../services/pedidosService";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);

  const loadPedidos = async () => {
    try {
      const res = await fetchPedidos();
      // Filtrar pedidos SOLO pendientes
      setPedidos(res.data.filter(p => p.estado === "pendiente"));
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  return (
    <DashboardLayout>
      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Mis pedidos pendientes
        </Typography>

        <Grid container spacing={2}>
          {pedidos.map(p => (
            <Grid item xs={12} md={6} key={p.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Pedido #{p.id}</Typography>
                  <Typography>Total: ${p.total}</Typography>
                  <Typography>Estado: {p.estado}</Typography>
                  <Typography>
                    Fecha: {new Date(p.fecha_creacion).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
