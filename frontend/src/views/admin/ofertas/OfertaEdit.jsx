// views/admin/ofertas/OfertaEdit.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductos } from "../../../services/productosService";
import { fetchOfertaById, updateOferta } from "../../../services/ofertasService";

export default function OfertaEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productos, setProductos] = useState([]);

  const [producto, setProducto] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState("");
  const [descuentoValor, setDescuentoValor] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState(true);

  const token = localStorage.getItem("access");

  // 🔹 Cargar productos desde el servicio
  const loadProductos = async () => {
    try {
      const res = await fetchProductos();
      setProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // 🔹 Cargar la oferta existente
  const loadOferta = async () => {
    try {
      const res = await fetchOfertaById(id);
      const data = res.data;

      setProducto(data.producto.id);
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
      setDescuentoPorcentaje(data.descuento_porcentaje);
      setDescuentoValor(data.descuento_valor);
      setFechaInicio(data.fecha_inicio.slice(0, 16));
      setFechaFin(data.fecha_fin.slice(0, 16));
      setEstado(data.estado);
    } catch (error) {
      console.error("Error al cargar la oferta:", error);
      alert("No se pudo cargar la oferta. Intenta recargar la página.");
    }
  };

  useEffect(() => {
    loadProductos();
    loadOferta();
  }, []);

  // 🔹 Guardar cambios usando el servicio
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateOferta(id, {
        producto,
        nombre,
        descripcion,
        descuento_porcentaje: descuentoPorcentaje || null,
        descuento_valor: descuentoValor || null,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado,
      });

      navigate("/admin/ofertas");
    } catch (error) {
      console.error("Error al actualizar la oferta:", error);
      alert("No se pudieron guardar los cambios. Verifica los datos.");
    }
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Editar Oferta
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Columna izquierda */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Producto"
                sx={{ mb: 2 }}
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                required
              >
                {productos.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Nombre de la oferta"
                sx={{ mb: 2 }}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <TextField
                fullWidth
                type="number"
                label="Descuento (%)"
                sx={{ mb: 2 }}
                value={descuentoPorcentaje}
                onChange={(e) => setDescuentoPorcentaje(e.target.value)}
              />

              <TextField
                fullWidth
                type="number"
                label="Descuento en valor ($)"
                sx={{ mb: 2 }}
                value={descuentoValor}
                onChange={(e) => setDescuentoValor(e.target.value)}
              />
            </Grid>

            {/* Columna derecha */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={5}
                sx={{ mb: 2 }}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha inicio"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />

              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha fin"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={estado}
                    onChange={(e) => setEstado(e.target.checked)}
                  />
                }
                label="Oferta activa"
              />
            </Grid>
          </Grid>

          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Guardar Cambios
          </Button>
        </form>
      </Box>
    </DashboardLayout>
  );
}
