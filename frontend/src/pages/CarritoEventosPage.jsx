import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout"
import { fetchEventos } from "../services/carritoEventosService";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

export default function CarritoEventosPage() {
  const [eventos, setEventos] = useState([]);

  const loadEventos = async () => {
    try {
      const res = await fetchEventos(); 
      setEventos(res.data);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  useEffect(() => {
    loadEventos();
  }, []);

  return (
    <DashboardLayout>
      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Estadísticas de Eventos del Carrito
        </Typography>

        <Grid container spacing={2}>
          {eventos.map((evt) => (
            <Grid item xs={12} md={4} key={evt.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Acción: {evt.accion}</Typography>
                  <Typography>Usuario: {evt.usuario_nombre}</Typography>
                  <Typography>Producto: {evt.producto_nombre}</Typography>
                  <Typography>
                    Cantidad:{" "}
                    {evt.cantidad === 0 ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        (superó la cantidad de stock)
                      </span>
                    ) : (
                      evt.cantidad
                    )}
                  </Typography>
                  <Typography>
                    Fecha: {new Date(evt.fecha).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
