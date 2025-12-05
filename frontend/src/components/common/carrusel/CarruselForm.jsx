// src/components/common/carrusel/CarruselForm.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function CarruselForm({ open, onClose, initialData, onSubmit }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    imagen: null, // ahora archivo
    url_destino: "",
    orden: 0,
  });

  const [preview, setPreview] = useState(null);

  // Cargar datos iniciales al editar
  useEffect(() => {
    if (initialData) {
      setForm({
        titulo: initialData.titulo || "",
        descripcion: initialData.descripcion || "",
        imagen: null, // archivo nuevo se carga aparte
        url_destino: initialData.url_destino || "",
        orden: initialData.orden || 0,
      });

      // Mostrar imagen actual en vista previa
      if (initialData.imagen) {
        setPreview(initialData.imagen.startsWith("http") 
          ? initialData.imagen 
          : `${process.env.REACT_APP_API_URL}${initialData.imagen}`
        );
      }
    } else {
      setForm({
        titulo: "",
        descripcion: "",
        imagen: null,
        url_destino: "",
        orden: 0,
      });
      setPreview(null);
    }
  }, [initialData]);

  // Manejo de inputs de texto
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Manejo de archivo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, imagen: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Enviar como FormData
  const handleSubmit = () => {
    const fd = new FormData();

    fd.append("titulo", form.titulo);
    fd.append("descripcion", form.descripcion);
    fd.append("url_destino", form.url_destino);
    fd.append("orden", form.orden);

    // Si el usuario seleccionó una nueva imagen, enviarla
    if (form.imagen instanceof File) {
      fd.append("imagen", form.imagen);
    }

    onSubmit(fd);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Editar Item" : "Nuevo Item"}</DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Título"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        {/* SUBIDA DE IMAGEN */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Imagen
          </Typography>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Previsualización */}
          {preview && (
            <Box mt={2}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Box>
          )}
        </Box>

        <TextField
          label="URL Destino"
          name="url_destino"
          value={form.url_destino}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Orden"
          type="number"
          name="orden"
          value={form.orden}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
