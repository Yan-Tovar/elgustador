import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

export default function ProductoCreate() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);

  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioAnterior, setPrecioAnterior] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [peso, setPeso] = useState("");
  const [datosNutricionales, setDatosNutricionales] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");

  const [categoria, setCategoria] = useState("");
  const [imagen1, setImagen1] = useState(null);
  const [imagen2, setImagen2] = useState(null);
  const [imagen3, setImagen3] = useState(null);

  const token = localStorage.getItem("access");

  const loadCategorias = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/categorias/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategorias(res.data);
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("codigo", codigo);
    formData.append("nombre", nombre);
    formData.append("marca", marca);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("precio_anterior", precioAnterior);
    formData.append("stock", stock);
    formData.append("categoria", categoria);

    formData.append("color", color);
    formData.append("peso", peso);
    formData.append("datos_nutricionales", datosNutricionales);
    formData.append("ingredientes", ingredientes);
    formData.append("instrucciones_uso", instrucciones);

    if (imagen1) formData.append("imagen1", imagen1);
    if (imagen2) formData.append("imagen2", imagen2);
    if (imagen3) formData.append("imagen3", imagen3);

    await axios.post("http://127.0.0.1:8000/api/productos/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    navigate("/admin/productos");
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Crear Producto</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* Columna izquierda */}
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Código" sx={{ mb: 2 }}
                value={codigo} onChange={(e) => setCodigo(e.target.value)} />

              <TextField fullWidth label="Nombre" sx={{ mb: 2 }}
                value={nombre} onChange={(e) => setNombre(e.target.value)} />

              <TextField fullWidth label="Marca" sx={{ mb: 2 }}
                value={marca} onChange={(e) => setMarca(e.target.value)} />

              <TextField fullWidth type="number" label="Precio" sx={{ mb: 2 }}
                value={precio} onChange={(e) => setPrecio(e.target.value)} />

              <TextField fullWidth type="number" label="Precio Anterior" sx={{ mb: 2 }}
                value={precioAnterior} onChange={(e) => setPrecioAnterior(e.target.value)} />

              <TextField fullWidth type="number" label="Stock" sx={{ mb: 2 }}
                value={stock} onChange={(e) => setStock(e.target.value)} />

              <TextField fullWidth select label="Categoría" sx={{ mb: 2 }}
                value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Columna derecha */}
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Descripción" multiline rows={4} sx={{ mb: 2 }}
                value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

              <TextField fullWidth label="Color" sx={{ mb: 2 }}
                value={color} onChange={(e) => setColor(e.target.value)} />

              <TextField fullWidth label="Peso" sx={{ mb: 2 }}
                value={peso} onChange={(e) => setPeso(e.target.value)} />

              <TextField fullWidth label="Datos Nutricionales" multiline rows={3} sx={{ mb: 2 }}
                value={datosNutricionales} onChange={(e) => setDatosNutricionales(e.target.value)} />

              <TextField fullWidth label="Ingredientes" multiline rows={3} sx={{ mb: 2 }}
                value={ingredientes} onChange={(e) => setIngredientes(e.target.value)} />

              <TextField fullWidth label="Instrucciones de Uso" multiline rows={3} sx={{ mb: 2 }}
                value={instrucciones} onChange={(e) => setInstrucciones(e.target.value)} />

              <Typography sx={{ mt: 2 }}>Imágenes del Producto</Typography>
              <input type="file" accept="image/*" onChange={(e) => setImagen1(e.target.files[0])} />
              <input type="file" accept="image/*" onChange={(e) => setImagen2(e.target.files[0])} />
              <input type="file" accept="image/*" onChange={(e) => setImagen3(e.target.files[0])} />
            </Grid>

          </Grid>

          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Guardar Producto
          </Button>
        </form>
      </Box>
    </DashboardLayout>
  );
}
