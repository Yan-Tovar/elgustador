// views/admin/ofertas/OfertasList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function OfertasList() {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);

  const token = localStorage.getItem("access");

  const loadOfertas = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/ofertas/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOfertas(res.data);
  };

  useEffect(() => {
    loadOfertas();
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Ofertas</Typography>
        <Button variant="contained" onClick={() => navigate("/admin/ofertas/nuevo")}>
          Nueva Oferta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {ofertas.map((oferta) => (
          <Grid item xs={12} md={4} key={oferta.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{oferta.nombre}</Typography>

                <Typography variant="body2">
                  Descuento:{" "}
                  {oferta.descuento_porcentaje
                    ? `${oferta.descuento_porcentaje}%`
                    : `$${oferta.descuento_valor}`}
                </Typography>

                <Typography variant="body2">
                  Desde: {new Date(oferta.fecha_inicio).toLocaleString()}
                </Typography>

                <Typography variant="body2">
                  Hasta: {new Date(oferta.fecha_fin).toLocaleString()}
                </Typography>

                <Chip
                  label={oferta.estado ? "Activa" : "Inactiva"}
                  color={oferta.estado ? "success" : "default"}
                  sx={{ mt: 1 }}
                />
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(`/admin/ofertas/${oferta.id}/editar`)}
                >
                  Editar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}
