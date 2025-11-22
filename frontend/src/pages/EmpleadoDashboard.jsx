// src/pages/AdminDashboard.jsx
import { Typography, Button, Grid, Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function EmpleadoDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Panel de Empleado</Typography>
        <Typography variant="body1" gutterBottom>
          Bienvenido al panel empleado.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}
