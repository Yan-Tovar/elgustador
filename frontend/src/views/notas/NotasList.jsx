import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNotas, deleteNota } from "../../services/notasService";
import { Box, Typography, Button, Grid, Snackbar, Alert } from "@mui/material";
import DashboardLayout from "../../components/layout/DashboardLayout";
import NotaCard from "../../components/notas/NotaCard";

export default function NotasList() {
  const navigate = useNavigate();
  const [notas, setNotas] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const loadNotas = async () => {
    try {
      const res = await fetchNotas();
      setNotas(res.data);
    } catch (error) {
      console.error("Error cargando notas:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNota(id);
      setSnackbar({ open: true, message: "Nota eliminada (desactivada).", severity: "success" });
      loadNotas();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Error al eliminar.", severity: "error" });
    }
  };

  useEffect(() => {
    loadNotas();
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
          Mis Notas
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => navigate("/notas/nueva")}
        >
          Crear Nota
        </Button>

        <Grid container spacing={2}>
          {notas.map((nota) => (
            <Grid item xs={12} sm={6} md={4} key={nota.id}>
              <NotaCard
                nota={nota}
                onEdit={() => navigate(`/notas/${nota.id}/editar`)}
                onDelete={() => handleDelete(nota.id)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoClose
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
