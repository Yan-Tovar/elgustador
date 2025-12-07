import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNota } from "../../services/notasService";
import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";

export default function NotaCreate() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNota(form);
      navigate("/notas");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al crear nota.",
        severity: "error",
      });
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          p: 4,
          maxWidth: 700,
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3, color: theme.palette.text.primary }}
        >
          Crear Nota
        </Typography>

        {/* Caja estilo cuaderno */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.palette.mode === "light" ? 4 : 8,
            position: "relative",
            overflow: "hidden",
            borderLeft: `6px solid ${theme.palette.secondary.main}`,

            /* Líneas estilo cuaderno */
            backgroundImage: `
              repeating-linear-gradient(
                to bottom,
                ${theme.palette.background.paper},
                ${theme.palette.background.paper} 46px,
                ${theme.palette.info.main}22 48px
              )
            `,
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Título */}
            <TextField
              label="Título"
              fullWidth
              variant="standard"
              InputLabelProps={{
                sx: { color: theme.palette.text.primary },
              }}
              sx={{
                mb: 3,
                "& .MuiInput-underline:before": {
                  borderBottomColor: theme.palette.info.main,
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: theme.palette.secondary.main,
                },
                "& input": {
                  color: theme.palette.text.primary,
                },
              }}
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />

            {/* Contenido */}
            <TextField
              label="Contenido"
              fullWidth
              multiline
              variant="standard"
              rows={7}
              InputLabelProps={{
                sx: { color: theme.palette.text.primary },
              }}
              sx={{
                mb: 3,
                "& .MuiInput-underline:before": {
                  borderBottomColor: theme.palette.info.main,
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: theme.palette.secondary.main,
                },
                "& textarea": {
                  color: theme.palette.text.primary,
                  lineHeight: "48px", // para encajar con líneas del cuaderno
                },
              }}
              value={form.contenido}
              onChange={(e) =>
                setForm({ ...form, contenido: e.target.value })
              }
            />

            {/* Botón */}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                mt: 2,
                py: 1.2,
                backgroundColor: theme.palette.secondary.main,
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              Guardar Nota
            </Button>
          </form>
        </Box>

        <Snackbar open={snackbar.open} autoHideDuration={3000}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
