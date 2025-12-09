import { useState } from "react";
import { Typography, Button, Box, Stack, Card, CardContent } from "@mui/material";
import DashboardLayout from "../components/layout/DashboardLayout";

// Importa tus gráficos de estadísticas
import PedidosChart from "../components/common/estadisticas/PedidosChart";
import InventarioChart from "../components/common/estadisticas/InventarioChart";
import UsuariosStats from "../components/common/estadisticas/UsuariosStats";

export default function AdminDashboard() {
  const [activeStat, setActiveStat] = useState("usuarios"); // valor por defecto

  const renderChart = () => {
    switch (activeStat) {
      case "usuarios":
        return <UsuariosStats />;
      case "pedidos":
        return <PedidosChart />;
      case "inventario":
        return <InventarioChart />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administrador
        </Typography>
        <Typography variant="body1" gutterBottom>
          Bienvenido al panel administrativo.
        </Typography>

        {/* Botones de selección de estadística */}
        <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
          <Button
            variant={activeStat === "usuarios" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setActiveStat("usuarios")}
          >
            Usuarios
          </Button>

          <Button
            variant={activeStat === "pedidos" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setActiveStat("pedidos")}
          >
            Pedidos
          </Button>

          <Button
            variant={activeStat === "inventario" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setActiveStat("inventario")}
          >
            Inventario
          </Button>
        </Stack>

        {/* Contenedor de la estadística activa */}
        <Card>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
