import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function CategoriasList() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("access");
    const res = await axios.get("http://127.0.0.1:8000/api/categorias/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategorias(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Categorías</Typography>

        <Button variant="contained" onClick={() => navigate("/admin/categorias/nuevo")}>
          Crear Categoría
        </Button>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categorias.map(cat => (
            <Grid item xs={12} sm={6} md={4} key={cat.id}>
              <Card sx={{ cursor: "pointer" }} onClick={() => navigate(`/admin/categorias/${cat.id}/editar`)}>
                {cat.imagen && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://127.0.0.1:8000${cat.imagen}`}
                    alt={cat.nombre}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{cat.nombre}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
