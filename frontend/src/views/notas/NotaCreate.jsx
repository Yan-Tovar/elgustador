import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNota } from "../../services/notasService";
import DashboardLayout from "../../components/layout/DashboardLayout";  
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";

export default function NotaCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNota(form);
      navigate("/notas");
    } catch (error) {
      setSnackbar({ open: true, message: "Error al crear nota.", severity: "error" });
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Crear Nota
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
            Guardar
          </Button>
        </form>

        <Snackbar open={snackbar.open} autoHideDuration={3000}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
