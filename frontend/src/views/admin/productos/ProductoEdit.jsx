// src/views/admin/productos/ProductoEdit.jsx
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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent
} from "@mui/material";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";

export default function ProductoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [step, setStep] = useState(0);
  const steps = [
    "Datos Básicos",
    "Datos Comerciales",
    "Información Adicional",
    "Imágenes",
    "Confirmar",
  ];

  // ===================================
  // Estados principales
  // ===================================
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
  });

  // Imagenes actuales del backend
  const [oldImg1, setOldImg1] = useState(null);
  const [oldImg2, setOldImg2] = useState(null);
  const [oldImg3, setOldImg3] = useState(null);

  // Nuevas imágenes
  const [imagen1, setImagen1] = useState(null);
  const [imagen2, setImagen2] = useState(null);
  const [imagen3, setImagen3] = useState(null);

  // Previews (nuevas)
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [preview3, setPreview3] = useState(null);

  // ===================================
  // Cargar categorías
  // ===================================
  const loadCategorias = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/categorias/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategorias(res.data);
  };

  // ===================================
  // Cargar producto existente
  // ===================================
  const loadProducto = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/productos/gestion/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const p = res.data;

    setForm({
      codigo: p.codigo,
      nombre: p.nombre,
      marca: p.marca,
      descripcion: p.descripcion,
      categoria: p.categoria,
      precio: p.precio,
      precioAnterior: p.precio_anterior,
      stock: p.stock,
      color: p.color,
      peso: p.peso,
      datosNutricionales: p.datos_nutricionales,
      ingredientes: p.ingredientes,
      instrucciones: p.instrucciones,
    });

    // Cargar imágenes actuales
    setOldImg1(p.imagen1 || null);
    setOldImg2(p.imagen2 || null);
    setOldImg3(p.imagen3 || null);
  };

  useEffect(() => {
    loadCategorias();
    loadProducto();
  }, []);

  // ===================================
  // Handlers
  // ===================================
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleImagenChange = (file, index) => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (index === 1) {
      setImagen1(file);
      setPreview1(url);
    } else if (index === 2) {
      setImagen2(file);
      setPreview2(url);
    } else {
      setImagen3(file);
      setPreview3(url);
    }
  };

  // ===================================
  // Enviar actualización
  // ===================================
  const handleSubmit = async () => {
    const fd = new FormData();

    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    // Solo enviar imágenes si el usuario las cambia
    if (imagen1) fd.append("imagen1", imagen1);
    if (imagen2) fd.append("imagen2", imagen2);
    if (imagen3) fd.append("imagen3", imagen3);

    await axios.patch(
      `http://127.0.0.1:8000/api/productos/gestion/${id}/`,
      fd,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    navigate("/admin/productos");
  };

  // ===================================
  // PASOS
  // ===================================
  const Paso1_DatosBasicos = () => (
    <TwoColumnInnerLayout
      left={
        <Box>
          <TextField
            fullWidth
            label="Código"
            sx={{ mb: 2 }}
            value={form.codigo}
            onChange={(e) => handleChange("codigo", e.target.value)}
          />

          <TextField
            fullWidth
            label="Nombre"
            sx={{ mb: 2 }}
            value={form.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
          />

          <TextField
            fullWidth
            label="Marca"
            sx={{ mb: 2 }}
            value={form.marca}
            onChange={(e) => handleChange("marca", e.target.value)}
          />
        </Box>
      }
      right={
        <Box>
          <TextField
            select
            fullWidth
            label="Categoría"
            sx={{ mb: 2 }}
            value={form.categoria.id}
            onChange={(e) => handleChange("categoria", e.target.value)}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descripción"
            value={form.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
          />
        </Box>
      }
    />
  );

  const Paso2_DatosComerciales = () => (
    <TwoColumnInnerLayout
      left={
        <Box>
          <TextField
            fullWidth
            type="number"
            label="Precio"
            sx={{ mb: 2 }}
            value={form.precio}
            onChange={(e) => handleChange("precio", e.target.value)}
          />

          <TextField
            fullWidth
            type="number"
            label="Precio Anterior"
            sx={{ mb: 2 }}
            value={form.precioAnterior}
            onChange={(e) => handleChange("precioAnterior", e.target.value)}
          />

          <TextField
            fullWidth
            type="number"
            label="Stock"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
          />
        </Box>
      }
      right={
        <Box>
          <TextField
            fullWidth
            label="Color"
            sx={{ mb: 2 }}
            value={form.color}
            onChange={(e) => handleChange("color", e.target.value)}
          />

          <TextField
            fullWidth
            label="Peso"
            value={form.peso}
            onChange={(e) => handleChange("peso", e.target.value)}
          />
        </Box>
      }
    />
  );

  const Paso3_InfoAdicional = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ my: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Datos Nutricionales"
          value={form.datosNutricionales}
          onChange={(e) => handleChange("datosNutricionales", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sx={{ my: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Ingredientes"
          value={form.ingredientes}
          onChange={(e) => handleChange("ingredientes", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sx={{ my: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Instrucciones de Uso"
          value={form.instrucciones}
          onChange={(e) => handleChange("instrucciones", e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const Paso4_Imagenes = () => (
    <TwoColumnInnerLayout
      left={
        <Box>
          <Grid container spacing={2}>
            {[1, 2, 3].map((n) => (
              <Grid item xs={12} md={4} key={n}>
                <Typography>Imagen {n}</Typography>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImagenChange(e.target.files[0], n)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      }
      right={
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          {/* Preview nueva o antigua */}
          {/* Imagen 1 */}
          {preview1 ? (
            <img
              src={preview1}
              alt="preview1"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
            />
          ) : oldImg1 ? (
            <img
              src={oldImg1}
              alt="old1"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
            />
          ) : null}

          {/* Imagen 2 */}
          {preview2 ? (
            <img
              src={preview2}
              alt="preview2"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
            />
          ) : oldImg2 ? (
            <img
              src={oldImg2}
              alt="old2"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
            />
          ) : null}

          {/* Imagen 3 */}
          {preview3 ? (
            <img
              src={preview3}
              alt="preview3"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
            />
          ) : oldImg3 ? (
            <img
              src={oldImg3}
              alt="old3"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
            />
          ) : null}
        </Box>
      }
    />
  );

  const Paso5_Confirmar = () => (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Confirma la información actualizada
        </Typography>

        <pre style={{ background: "#f5f5f5", padding: 15, borderRadius: 8 }}>
          {JSON.stringify(form, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );

  const renderStep = () => {
    switch (step) {
      case 0: return <Paso1_DatosBasicos />;
      case 1: return <Paso2_DatosComerciales />;
      case 2: return <Paso3_InfoAdicional />;
      case 3: return <Paso4_Imagenes />;
      case 4: return <Paso5_Confirmar />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Editar Producto
        </Typography>

        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>{renderStep()}</Box>

        <Grid container justifyContent="space-between">
          <Button
            disabled={step === 0}
            onClick={prevStep}
            variant="outlined"
          >
            Atrás
          </Button>

          {step < steps.length - 1 ? (
            <Button variant="contained" onClick={nextStep}>
              Siguiente
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Guardar Cambios
            </Button>
          )}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
