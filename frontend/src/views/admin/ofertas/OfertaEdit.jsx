import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";

import { fetchProductos } from "../../../services/productosService";
import { fetchOfertaById, updateOferta } from "../../../services/ofertasService";

import {
  showAlert,
  showToast,
} from "../../../components/feedback/SweetAlert";

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

  // =============================
  // Cargar productos
  // =============================
  const loadProductos = async () => {
    try {
      const res = await fetchProductos();
      setProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      showAlert(
        "Error",
        "No se pudieron cargar los productos",
        "error"
      );
    }
  };

  // =============================
  // Cargar oferta
  // =============================
  const loadOferta = async () => {
    try {
      const res = await fetchOfertaById(id);
      const data = res.data;

      setProducto(data.producto.id);
      setNombre(data.nombre);
      setDescripcion(data.descripcion || "");
      setDescuentoPorcentaje(data.descuento_porcentaje || "");
      setDescuentoValor(data.descuento_valor || "");
      setFechaInicio(data.fecha_inicio?.slice(0, 16));
      setFechaFin(data.fecha_fin?.slice(0, 16));
      setEstado(data.estado);
    } catch (error) {
      console.error("Error al cargar la oferta:", error);
      showAlert(
        "Error",
        "No se pudo cargar la oferta",
        "error"
      );
    }
  };

  useEffect(() => {
    loadProductos();
    loadOferta();
  }, []);

  // =============================
  // Guardar cambios
  // =============================
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

      showToast("Oferta actualizada correctamente", "success");
      navigate("/admin/ofertas");
    } catch (error) {
      console.error("Error al actualizar la oferta:", error);
      showAlert(
        "Error",
        "No se pudieron guardar los cambios",
        "error"
      );
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Editar Oferta
        </Typography>

        <form onSubmit={handleSubmit}>
          <TwoColumnInnerLayout
            left={
              <>
                <TextField
                  fullWidth
                  select
                  label="Producto"
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
                  sx={{ mb: 2 }}
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
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Descuento (%)"
                  value={descuentoPorcentaje}
                  onChange={(e) => setDescuentoPorcentaje(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Descuento en valor ($)"
                  value={descuentoValor}
                  onChange={(e) => setDescuentoValor(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            }
            right={
              <>
                <TextField
                  fullWidth
                  label="Descripción"
                  multiline
                  rows={5}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Fecha inicio"
                  InputLabelProps={{ shrink: true }}
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Fecha fin"
                  InputLabelProps={{ shrink: true }}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={estado}
                      onChange={(e) => setEstado(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Oferta activa"
                />
              </>
            }
          />

          <Box sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Guardar Cambios
            </Button>
          </Box>
        </form>
      </Box>
    </DashboardLayout>
  );
}
