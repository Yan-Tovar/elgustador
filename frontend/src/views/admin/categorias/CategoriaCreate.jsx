import { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function CategoriaCreate() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    if (imagen) formData.append("imagen", imagen);

    await axios.post("http://127.0.0.1:8000/api/categorias/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    navigate("/admin/categorias");
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Crear Categoría</Typography>

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

          <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />

          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Guardar
          </Button>
        </form>
      </Box>
    </DashboardLayout>
  );
}
