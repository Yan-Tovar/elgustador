// src/pages/AdminDashboard.jsx
import { Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutBackend } from "../utils/Auth";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Panel de Administrador</Typography>
      <Typography variant="body1" gutterBottom>Bienvenido al panel administrativo. </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Departamentos</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => navigate("/admin/departamentos")}>
                Gestionar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Usuarios</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => navigate("/admin/usuarios")}>
                Gestionar
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <logoutBackend></logoutBackend>
      </Grid>
    </Container>
  );
}
