// components/common/PqrsForm.jsx
import { useState, useContext } from "react";
import { Box, Button, TextField, MenuItem, Typography, Alert } from "@mui/material";
import { createPqrs } from "../../services/pqrsService";
import { AuthContext } from "../../context/AuthContext";

const TIPOS_PQRS = [
  { value: "Queja", label: "Queja" },
  { value: "Reclamo", label: "Reclamo" },
  { value: "Petición", label: "Petición" },
  { value: "Sugerencia", label: "Sugerencia" },
];

export default function PqrsForm({ onSuccess }) {
  const { user } = useContext(AuthContext);

  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!tipo || !descripcion) return setError("Por favor completa todos los campos.");

    setLoading(true);

    try {
      const payload = {
        tipo,
        descripcion,
        estado: "Pendiente",
        usuario: user ? user.id : null, // si hay sesión, se asigna usuario
      };

      await createPqrs(payload);

      setSuccess("PQRS enviado correctamente.");
      setTipo("");
      setDescripcion("");

      if (onSuccess) onSuccess(); // callback opcional
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar el PQRS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{

      }}
    >

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
      {success && <Alert severity="success" sx={{mb: 2}}>{success}</Alert>}

      <TextField
        select
        label="Tipo de PQRS"
        value={tipo}
        color="secondary"
        onChange={(e) => setTipo(e.target.value)}
        fullWidth
        required
        sx={{mb:2}}
      >
        {TIPOS_PQRS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Descripción"
        multiline
        rows={4}
        color="secondary"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        fullWidth
        required
        sx={{mb: 2}}
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? "Enviando..." : "Enviar PQRS"}
      </Button>
    </Box>
  );
}
