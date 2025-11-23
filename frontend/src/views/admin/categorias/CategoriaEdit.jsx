import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Card, CardMedia } from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function CategoriaEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("access");

  const loadCategoria = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/categorias/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNombre(res.data.nombre);
    setDescripcion(res.data.descripcion || "");
    setPreview(res.data.imagen ? `http://127.0.0.1:8000${res.data.imagen}` : null);
  };

  useEffect(() => {
    loadCategoria();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    if (imagen) formData.append("imagen", imagen);

    await axios.patch(
      `http://127.0.0.1:8000/api/categorias/${id}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    navigate("/admin/categorias");
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Editar Categoría</Typography>

        {preview && (
          <Card sx={{ mb: 2, maxWidth: 250 }}>
            <CardMedia component="img" image={preview} alt="preview" />
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            sx={{ mb: 2 }}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <TextField
            fullWidth
            label="Descripción"
            multiline
            sx={{ mb: 2 }}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />

          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Actualizar
          </Button>
        </form>
      </Box>
    </DashboardLayout>
  );
}
