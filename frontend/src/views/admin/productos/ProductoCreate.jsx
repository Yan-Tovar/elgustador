// src/views/admin/productos/ProductoCreate.jsx
import { useEffect, useState } from "react";
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
  CardContent,
} from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductoCreate() {
  const navigate = useNavigate();

  // =======================
  // Estados principales
  // =======================
  const [step, setStep] = useState(0);
  const steps = [
    "Datos Básicos",
    "Datos Comerciales",
    "Información Adicional",
    "Imágenes",
    "Confirmar",
  ];

  const [categorias, setCategorias] = useState([]);

  // Formulario
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

  // Imagenes
  const [imagen1, setImagen1] = useState(null);
  const [imagen2, setImagen2] = useState(null);
  const [imagen3, setImagen3] = useState(null);

  const token = localStorage.getItem("access");

  // =======================
  // Cargar categorías
  // =======================
  const loadCategorias = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/categorias/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategorias(res.data);
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  // =======================
  // Handlers
  // =======================
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // =======================
  // Enviar datos
  // =======================
  const handleSubmit = async () => {
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (imagen1) fd.append("imagen1", imagen1);
    if (imagen2) fd.append("imagen2", imagen2);
    if (imagen3) fd.append("imagen3", imagen3);

    await axios.post("http://127.0.0.1:8000/api/productos/", fd, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/admin/productos");
  };

  // =======================
  // Componentes por paso
  // =======================
  const Paso1_DatosBasicos = () => (
    <Grid container spacing={2} sx={{display: "block"}}>
      <TwoColumnInnerLayout 

        left={
          <Box>
            <Grid item xs={12} md={6} sx={{my: 1}}>
              <TextField fullWidth label="Código"
                value={form.codigo}
                onChange={(e) => handleChange("codigo", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{my: 1}}>
              <TextField fullWidth label="Nombre"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{my: 1}}>
              <TextField fullWidth label="Marca"
                value={form.marca}
                onChange={(e) => handleChange("marca", e.target.value)}
              />
            </Grid>
          </Box>
        }
        right={
          <Box>
            <Grid item xs={12} md={6} sx={{my: 1}}>
              <TextField select fullWidth label="Categoría"
                value={form.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sx={{my: 1}}>
              <TextField
                fullWidth label="Descripción"
                multiline rows={4}
                value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
              />
            </Grid>
          </Box>
        }
      />
    </Grid>
  );

  const Paso2_DatosComerciales = () => (
    <Grid container spacing={2}>
      <TwoColumnInnerLayout 
        left={
          <Box>
            <Grid item xs={12} md={4} sx={{my: 1}}>
              <TextField fullWidth type="number" label="Precio"
                value={form.precio}
                onChange={(e) => handleChange("precio", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{my: 1}}>
              <TextField fullWidth type="number" label="Precio Anterior"
                value={form.precioAnterior}
                onChange={(e) => handleChange("precioAnterior", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4} sx={{my: 1}}>
              <TextField fullWidth type="number" label="Stock"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
              />
            </Grid>
          </Box>
        }
        right={
          <Box>
            <Grid item xs={12} md={6} sx={{my: 1}}>
              <TextField fullWidth label="Color"
                value={form.color}
                onChange={(e) => handleChange("color", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{my: 1}}>
              <TextField fullWidth label="Peso"
                value={form.peso}
                onChange={(e) => handleChange("peso", e.target.value)}
              />
            </Grid>
          </Box>
        }
      />
    </Grid>
  );

  const Paso3_InfoAdicional = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{my: 1}}>
        <TextField fullWidth multiline rows={3} label="Datos Nutricionales"
          value={form.datosNutricionales}
          onChange={(e) => handleChange("datosNutricionales", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sx={{my: 1}}>
        <TextField fullWidth multiline rows={3} label="Ingredientes"
          value={form.ingredientes}
          onChange={(e) => handleChange("ingredientes", e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sx={{my: 1}}>
        <TextField fullWidth multiline rows={3} label="Instrucciones de Uso"
          value={form.instrucciones}
          onChange={(e) => handleChange("instrucciones", e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [preview3, setPreview3] = useState(null);
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
          {/* Previsualizaciones */}
          {preview1 && (
            <Box
              component="img"
              src={preview1}
              alt="Imagen 1"
              sx={{
                width: 80,
                height: 80,
                padding: 1,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          )}

          {preview2 && (
            <Box
              component="img"
              src={preview2}
              alt="Imagen 2"
              sx={{
                width: 80,
                height: 80,
                padding: 1,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          )}

          {preview3 && (
            <Box
              component="img"
              src={preview3}
              alt="Imagen 3"
              sx={{
                width: 80,
                height: 80,
                padding: 1,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          )}

          {/* Si no hay imágenes aún */}
          {!preview1 && !preview2 && !preview3 && (
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              No hay imágenes seleccionadas
            </Typography>
          )}
        </Box>
      }
    />
  );

  const Paso5_Confirmar = () => (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Revisa que toda la información esté correcta.
        </Typography>

        <pre style={{ background: "#f5f5f5", padding: 15, borderRadius: 8 }}>
          {JSON.stringify(form, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );

  // =======================
  // Contenido dinámico
  // =======================
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
          Crear Producto
        </Typography>

        {/* STEPPER */}
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {/* CONTENIDO */}
        <Box sx={{ mb: 4 }}>{renderStep()}</Box>

        {/* BOTONES */}
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
              Guardar Producto
            </Button>
          )}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
