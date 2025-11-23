import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Card,
  CardMedia
} from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function ProductoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("access");

  const loadCategorias = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/categorias/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategorias(res.data);
  };

  const loadProducto = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/productos/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNombre(res.data.nombre);
    setDescripcion(res.data.descripcion);
    setPrecio(res.data.precio);
    setStock(res.data.stock);
    setCategoria(res.data.categoria);
    setPreview(res.data.imagen ? `http://127.0.0.1:8000${res.data.imagen}` : null);
  };

  useEffect(() => {
    loadCategorias();
    loadProducto();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("stock", stock);
    formData.append("categoria", categoria);
    if (imagen) formData.append("imagen", imagen);

    await axios.patch(
      `http://127.0.0.1:8000/api/productos/${id}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    navigate("/admin/productos");
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Editar Producto</Typography>

        {preview && (
          <Card sx={{ mb: 2, maxWidth: 250 }}>
            <CardMedia component="img" image={preview} alt="preview" />
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                sx={{ mb: 2 }}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <TextField
                fullWidth
                label="Precio"
                type="number"
                sx={{ mb: 2 }}
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />

              <TextField
                fullWidth
                label="Stock"
                type="number"
                sx={{ mb: 2 }}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />

              <TextField
                fullWidth
                select
                label="Categoría"
                sx={{ mb: 2 }}
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={6}
                sx={{ mb: 2 }}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

              <Typography sx={{ mb: 1 }}>Cambiar Imagen</Typography>
              <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} />
            </Grid>
          </Grid>

          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Actualizar Producto
          </Button>
        </form>
      </Box>
    </DashboardLayout>
  );
}
