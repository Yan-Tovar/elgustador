// src/views/admin/productos/ProductoCreate.jsx
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";
import { useNavigate } from "react-router-dom";
import { createProducto } from "../../../services/productosService"; 
import { fetchCategorias } from "../../../services/categoriasService"; 

export default function ProductoCreate() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    marca: "",
    descripcion: "",
    categoria: "", 
    precio: "",
    precioAnterior: "",
    stock: "",
    color: "",
    peso: "",
    datosNutricionales: "",
    ingredientes: "",
    instrucciones: "",
    estado: true,
  });

  const [imagen1, setImagen1] = useState(null);
  const [imagen2, setImagen2] = useState(null);
  const [imagen3, setImagen3] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [preview3, setPreview3] = useState(null);

  const handleImagenChange = (file, index) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (index === 1) { setImagen1(file); setPreview1(url); }
    else if (index === 2) { setImagen2(file); setPreview2(url); }
    else { setImagen3(file); setPreview3(url); }
  };

  const loadCategorias = async () => {
    try {
      const res = await fetchCategorias(); 
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    const cleanedForm = { ...form };
    const nullableFields = [
      "precioAnterior", "categoria", "marca", "color", "peso", 
      "descripcion", "datosNutricionales", "ingredientes", "instrucciones"
    ];
    nullableFields.forEach(field => {
      if (cleanedForm[field] === "") cleanedForm[field] = null;
    });

    if (cleanedForm.precio !== null && cleanedForm.precio !== "") {
      cleanedForm.precio = parseFloat(cleanedForm.precio);
    }
    if (cleanedForm.stock !== null && cleanedForm.stock !== "") {
      cleanedForm.stock = parseInt(cleanedForm.stock, 10);
    }

    const fd = new FormData();
    Object.keys(cleanedForm).forEach((key) => {
      const value = cleanedForm[key];
      if (value === null) return;
      if (typeof value === 'boolean') fd.append(key, value ? 'True' : 'False');
      else fd.append(key, value);
    });

    if (imagen1) fd.append("imagen1", imagen1);
    if (imagen2) fd.append("imagen2", imagen2);
    if (imagen3) fd.append("imagen3", imagen3);

    try {
      await createProducto(fd);
      navigate("/admin/productos");
    } catch (error) {
      console.error("Error al crear producto:", error.response?.data);
      const errorMsg = error.response?.data ? 
                       JSON.stringify(error.response.data) : 
                       "Ocurrió un error desconocido. Verifica la conexión y los campos.";
      alert(`Error al guardar el producto. Detalles: ${errorMsg}`);
    }
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Crear Producto
        </Typography>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TwoColumnInnerLayout
            left={
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  "& > div": { flex: "1 1 45%" },
                  "@media (max-width:600px)": { "& > div": { flex: "1 1 100%" } },
                }}
              >
                <Box>
                  <TextField
                    fullWidth
                    label="Código"
                    required
                    value={form.codigo}
                    onChange={(e) => handleChange("codigo", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Nombre"
                    required
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Marca"
                    value={form.marca}
                    onChange={(e) => handleChange("marca", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    select
                    fullWidth
                    label="Categoría"
                    value={form.categoria || ""}
                    onChange={(e) => handleChange("categoria", e.target.value)}
                  >
                    <MenuItem value="">-- Seleccionar Categoría --</MenuItem>
                    {categorias.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ flex: "1 1 100%" }}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    multiline
                    rows={4}
                    value={form.descripcion}
                    onChange={(e) => handleChange("descripcion", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    type="number"
                    label="Precio"
                    required
                    value={form.precio}
                    onChange={(e) => handleChange("precio", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    type="number"
                    label="Precio Anterior"
                    value={form.precioAnterior}
                    onChange={(e) => handleChange("precioAnterior", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    type="number"
                    label="Stock"
                    required
                    value={form.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Color"
                    value={form.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Peso"
                    value={form.peso}
                    onChange={(e) => handleChange("peso", e.target.value)}
                  />
                </Box>
              </Box>
            }
            right={
              <Box>
                <Box sx={{ mb: 2 }}>
                  <TextField fullWidth multiline rows={3} label="Datos Nutricionales"
                    value={form.datosNutricionales}
                    onChange={(e) => handleChange("datosNutricionales", e.target.value)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <TextField fullWidth multiline rows={3} label="Ingredientes"
                    value={form.ingredientes}
                    onChange={(e) => handleChange("ingredientes", e.target.value)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <TextField fullWidth multiline rows={3} label="Instrucciones de Uso"
                    value={form.instrucciones}
                    onChange={(e) => handleChange("instrucciones", e.target.value)}
                  />
                </Box>

                {[1,2,3].map((n) => (
                  <Box key={n} sx={{ mb: 2 }}>
                    <Typography>Imagen {n}</Typography>
                    <input type="file" accept="image/*"
                      onChange={(e) => handleImagenChange(e.target.files[0], n)}
                    />
                  </Box>
                ))}

                <Box sx={{ display:"flex", gap:2, flexWrap:"wrap", justifyContent:"center", alignItems:"center", p:2 }}>
                  {preview1 && <Box component="img" src={preview1} alt="Imagen 1" sx={{ width:80, height:80, objectFit:"cover", borderRadius:2, boxShadow:3 }}/>}
                  {preview2 && <Box component="img" src={preview2} alt="Imagen 2" sx={{ width:80, height:80, objectFit:"cover", borderRadius:2, boxShadow:3 }}/>}
                  {preview3 && <Box component="img" src={preview3} alt="Imagen 3" sx={{ width:80, height:80, objectFit:"cover", borderRadius:2, boxShadow:3 }}/>}
                  {!preview1 && !preview2 && !preview3 && (
                    <Typography variant="body2" sx={{ opacity:0.6 }}>No hay imágenes seleccionadas</Typography>
                  )}
                </Box>
              </Box>
            }
          />

          <Grid container justifyContent="flex-end" sx={{ mt:3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!form.codigo || !form.nombre || !form.precio || !form.stock}
            >
              Guardar Producto
            </Button>
          </Grid>
        </form>
      </Box>
    </DashboardLayout>
  );
}
