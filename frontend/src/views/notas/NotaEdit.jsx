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
      <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
           Editar Nota
        </Typography>

        {/* CUADERNO */}
        <Box
          sx={{
            borderRadius: "12px",
            background: "#faf7f2",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            p: 4,
            position: "relative",
            overflow: "hidden",
            "::before": {
              content: '""',
              position: "absolute",
              left: "40px",
              top: 0,
              bottom: 0,
              width: "2px",
              background: "#d9534f", // línea roja del cuaderno
            },
            "::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(#e3e0db 0px, #e3e0db 1px, transparent 1px, transparent 28px)",
              pointerEvents: "none",
            },
          }}
        >
          {/* Título como encabezado de cuaderno */}
          <TextField
            label="Título"
            fullWidth
            sx={{
              mb: 4,
              "& .MuiInputBase-root": {
                background: "transparent",
                fontSize: "1.3rem",
                fontWeight: "bold",
              },
            }}
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />

          {/* CONTENIDO CON EFECTO DE ESCRITURA EN LÍNEAS */}
          <textarea
            value={form.contenido}
            onChange={(e) => setForm({ ...form, contenido: e.target.value })}
            style={{
              width: "100%",
              minHeight: "350px",
              resize: "vertical",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "1.1rem",
              lineHeight: "28px",
              paddingLeft: "60px",   // respeta margen roja
              fontFamily: "inherit",
              position: "relative",
              zIndex: 10,
            }}
          />

          {/* Botón */}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
          >
            Guardar Cambios
          </Button>
        </Box>

        <Snackbar open={snackbar.open} autoHideDuration={3000}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
