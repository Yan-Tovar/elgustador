import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function ProductosList() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  const load = async () => {
    const token = localStorage.getItem("access");
    const res = await axios.get("http://127.0.0.1:8000/api/productos/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProductos(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Productos</Typography>

        <Button variant="contained" onClick={() => navigate("/admin/productos/nuevo")}>
          Crear Producto
        </Button>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {productos.map(prod => (
            <Grid item xs={12} sm={6} md={4} key={prod.id}>
              <Card sx={{ cursor: "pointer" }} onClick={() => navigate(`/admin/productos/${prod.id}/editar`)}>
                {prod.imagen && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`http://127.0.0.1:8000${prod.imagen}`}
                    alt={prod.nombre}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{prod.nombre}</Typography>
                  <Typography variant="body2">Precio: ${prod.precio}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
