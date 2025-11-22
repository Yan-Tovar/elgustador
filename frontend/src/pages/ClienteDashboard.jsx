// src/pages/AdminDashboard.jsx
import { Typography, Button, Grid, Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function ClienteDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Panel de Cliente</Typography>
        <Typography variant="body1" gutterBottom>
          Bienvenido al panel Cliente.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}
