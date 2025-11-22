// src/pages/ClienteDashboard.jsx
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logoutBackend } from "../utils/Auth";
import LogoutButton from "../components/LogoutButton";

export default function ClienteDashboard() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Panel de Cliente</Typography>
      <Typography variant="body1" gutterBottom>Bienvenido.</Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Este es un btn de ejemplo</Typography>
              <LogoutButton></LogoutButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
