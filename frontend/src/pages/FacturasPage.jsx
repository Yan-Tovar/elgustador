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

import { getFacturasUsuario } from "../services/facturasService";

export default function FacturasPage() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando facturas...</Typography>
      </Box>
    );
  }

  return (
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
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/factura/${factura.id}`)}
                    >
                      Ver Factura
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
