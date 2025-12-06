import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Card,
  CardMedia,
  useTheme,
} from "@mui/material";

export default function CategoriaForm({
  initial = null,
  onSubmit,
  submitting = false,
  resetKey = null,
}) {
  const theme = useTheme();

  // estado local CONTROLADO
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [estado, setEstado] = useState(true);

  const initializedForId = useRef(null);

  useEffect(() => {
    const incomingId = initial?.id ?? null;

    if (initializedForId.current !== incomingId || resetKey != null) {
      initializedForId.current = incomingId;

      setNombre(initial?.nombre ?? "");
      setDescripcion(initial?.descripcion ?? "");
      setEstado(initial?.estado ?? true);
      setImagen(null);

      if (initial?.imagen) {
        const url =
          initial.imagen_url ||
          (typeof initial.imagen === "string"
            ? initial.imagen.startsWith("http")
              ? initial.imagen
              : `http://127.0.0.1:8000${initial.imagen}`
            : null);

        setPreview(url);
      } else {
        setPreview(null);
      }
    }
  }, [initial?.id, resetKey]);

  const handleImagenChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setImagen(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) return;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("estado", estado);

    if (imagen) formData.append("imagen", imagen);

    onSubmit(formData);
  };

  // ─────────────────────────────────────────────
  //  LÓGICA NUEVA DEL ESTADO
  // Crear: initial == null → siempre mostrar switch
  // Editar:
  //   estado true  → NO mostrar switch
  //   estado false → SÍ mostrar switch
  // ─────────────────────────────────────────────

  const debeMostrarSwitch =
    initial === null // creación
      ? true
      : initial.estado === false; // edición solo si está desactivada

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: theme.palette.background.paper,
        p: 2,
        borderRadius: 2,
      }}
    >
      <TextField
        name="nombre"
        label="Nombre de la categoría"
        color="secondary"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        fullWidth
      />

      <TextField
        name="descripcion"
        label="Descripción"
        color="secondary"
        multiline
        minRows={3}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        fullWidth
      />

      <Box>
        <Button variant="outlined" component="label" color="secondary" sx={{ mb: 1 }}>
          Subir imagen
          <input hidden accept="image/*" type="file" onChange={handleImagenChange} />
        </Button>

        {preview && (
          <Card sx={{ width: 180, borderRadius: 2, mt: 1 }}>
            <CardMedia component="img" height="120" image={preview} alt="Preview" />
          </Card>
        )}
      </Box>

      {/* ✔ Switch solo cuando corresponde */}
      {debeMostrarSwitch && (
        <FormControlLabel
          control={
            <Switch
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
              color="secondary"
            />
          }
          label="Activo"
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button type="submit" variant="contained" color="secondary" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar Categoría"}
        </Button>
      </Box>
    </Box>
  );
}
