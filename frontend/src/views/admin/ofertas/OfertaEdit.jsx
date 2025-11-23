// views/admin/ofertas/OfertaEdit.jsx
import { useEffect, useState } from "react";
import axios from "axios";
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

  const loadProductos = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/productos/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProductos(res.data);
  };

  const loadOferta = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/api/ofertas/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducto(res.data.producto.id);
    setNombre(res.data.nombre);
    setDescripcion(res.data.descripcion);
    setDescuentoPorcentaje(res.data.descuento_porcentaje);
    setDescuentoValor(res.data.descuento_valor);
    setFechaInicio(res.data.fecha_inicio.slice(0, 16));
    setFechaFin(res.data.fecha_fin.slice(0, 16));
    setEstado(res.data.estado);
  };

  useEffect(() => {
    loadProductos();
    loadOferta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://127.0.0.1:8000/api/ofertas/${id}/`,
      {
        producto,
        nombre,
        descripcion,
        descuento_porcentaje: descuentoPorcentaje || null,
        descuento_valor: descuentoValor || null,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    navigate("/admin/ofertas");
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Editar Oferta
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Producto"
                sx={{ mb: 2 }}
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
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
