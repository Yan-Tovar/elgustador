import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

import {
  getFacturasUsuario,
  descargarFacturaPDF,
  enviarFacturaEmail,
} from "../services/facturasService";
import DashboardLayout from "../components/layout/DashboardLayout"

import { saveAs } from "file-saver";

export default function FacturasPage() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviandoId, setEnviandoId] = useState(null);

  const cargarFacturas = async () => {
    try {
      const res = await getFacturasUsuario();
      setFacturas(res.data);
    } catch (err) {
      console.error("Error cargando facturas:", err);
      alert("No se pudieron cargar las facturas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarFacturas();
  }, []);

  const handleDescargar = async (id) => {
    try {
      const response = await descargarFacturaPDF(id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `factura_${id}.pdf`);
    } catch (error) {
      console.error("Error descargando factura:", error);
      alert("Hubo un error al descargar la factura.");
    }
  };

  const handleEnviarCorreo = async (id) => {
    try {
      setEnviandoId(id); // ➤ Deshabilita solo el botón de esta factura

      await enviarFacturaEmail(id);

      alert("Factura enviada al correo.");
    } catch (error) {
      console.error("Error enviando factura:", error);
      alert("No se pudo enviar la factura por correo.");
    } finally {
      setEnviandoId(null); // ➤ Reactiva el botón
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box p={4} textAlign="center">
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando facturas...</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box p={4}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Mis Facturas
        </Typography>

        {facturas.length === 0 ? (
          <Typography>No tienes facturas aún.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Número de Factura</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {facturas.map((factura) => (
                  <TableRow key={factura.id}>
                    <TableCell>{factura.id}</TableCell>
                    <TableCell>{factura.numero_factura}</TableCell>
                    <TableCell>${factura.total}</TableCell>
                    <TableCell>
                      {new Date(factura.fecha).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Box display="flex" gap={1}>
                        {/* Ver factura */}
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/factura/${factura.id}`)}
                        >
                          Ver
                        </Button>

                        {/* Descargar PDF */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDescargar(factura.id)}
                        >
                          Descargar
                        </Button>

                        {/* Enviar por correo */}
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          disabled={enviandoId === factura.id} 
                          onClick={() => handleEnviarCorreo(factura.id)}
                        >
                          {enviandoId === factura.id ? "Enviando..." : "Enviar Email"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </DashboardLayout>
  );
}
