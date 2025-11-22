// src/pages/EmpleadoDashboard.jsx
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/auth/LogoutButton";

export default function EmpleadoDashboard() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Panel de Empleado</Typography>
      <Typography variant="body1" gutterBottom>Bienvenido al panel de empleado.</Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">sesion</Typography>
               <LogoutButton></LogoutButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
