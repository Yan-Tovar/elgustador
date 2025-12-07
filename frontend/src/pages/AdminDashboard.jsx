// src/pages/AdminDashboard.jsx
import { Typography, Button, Grid, Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PedidosChart from "../components/common/estadisticas/PedidosChart";
import InventarioChart from "../components/common/estadisticas/InventarioChart";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Panel de Administrador</Typography>
        <Typography variant="body1" gutterBottom>
          Bienvenido al panel administrativo.
        </Typography>
          <PedidosChart></PedidosChart>
          <InventarioChart></InventarioChart>
      </Box>
    </DashboardLayout>
  );
}
