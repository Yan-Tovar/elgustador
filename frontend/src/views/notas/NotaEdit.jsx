import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchNotaById, updateNota } from "../../services/notasService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";

export default function NotaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const loadNota = async () => {
    try {
      const res = await fetchNotaById(id);
      setForm({
        titulo: res.data.titulo,
        contenido: res.data.contenido,
      });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Error cargando nota.", severity: "error" });
    }
  };

  useEffect(() => {
    loadNota();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateNota(id, form);
      navigate("/notas");
    } catch (error) {
      setSnackbar({ open: true, message: "Error al actualizar.", severity: "error" });
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Editar Nota
        </Typography>

        <form onSubmit={handleSubmit}>

          <TextField
            label="Título"
            fullWidth
            sx={{ mb: 2 }}
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />

          <TextField
            label="Contenido"
            fullWidth
            multiline
            rows={5}
            sx={{ mb: 2 }}
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
          />

          <Button variant="contained" fullWidth type="submit">
            Actualizar
          </Button>
        </form>

        <Snackbar open={snackbar.open} autoHideDuration={3000}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
