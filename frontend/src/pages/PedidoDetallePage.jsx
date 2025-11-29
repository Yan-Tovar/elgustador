import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  useTheme,
  Divider
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import { fetchPedidoDetalle, getPedido } from "../services/pedidosService";

import PedidoProductosListado from "../components/common/pedidos/PedidoProductosListado";
import PedidoResumen from "../components/common/pedidos/PedidoResumen";
import PedidoEstadoFlujo from "../components/common/pedidos/PedidoEstadoFlujo";

import TwoColumnInnerLayout from "../components/layout/TwoColumnInnerLayout";

export default function PedidoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

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

      {/* BARRA SUPERIOR DEL PEDIDO */}
      <Box
        sx={{
          width: "100%",
          p: 2,
          mb: 3,
          borderRadius: 2,
          boxShadow: 3,
          background: theme.palette.background.paper,
        }}
      >
        <Divider sx={{ mb: 2 }}>Estado del Pedido</Divider>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 2, md: 4 },
          }}
        >
          <PedidoEstadoFlujo estado={pedido.estado} />

          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "green",
              color: "black",
              height: 40,
              width: { xs: "100%", md: "auto" },
              mt: { xs: 1, md: 0 },
            }}
          >
            Pedidos
          </Button>
        </Box>
      </Box>

      {/* LAYOUT REUTILIZABLE */}
      <TwoColumnInnerLayout
        left={<PedidoProductosListado detalles={detalles} />}
        right={<PedidoResumen pedido={pedido} />}
      />
    </DashboardLayout>
  );
}
