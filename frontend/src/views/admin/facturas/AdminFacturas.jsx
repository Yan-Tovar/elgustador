import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getFacturasAdmin } from "../../../services/facturasService";

export default function AdminFacturas() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFacturas = async () => {
    try {
      const res = await getFacturasAdmin();
      setFacturas(res.data);
    } catch (err) {
      setError("Error cargando las facturas del sistema.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  return (
    <DashboardLayout>
      <Box p={3}>
        <Typography variant="h4" mb={3}>
          Facturas del Sistema
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Paper sx={{ overflowX: "auto", p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>ID</b></TableCell>
                  <TableCell><b>N° Factura</b></TableCell>
                  <TableCell><b>Pedido</b></TableCell>
                  <TableCell><b>Subtotal</b></TableCell>
                  <TableCell><b>Impuestos</b></TableCell>
                  <TableCell><b>Total</b></TableCell>
                  <TableCell><b>Fecha</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {facturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay facturas registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  facturas.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.id}</TableCell>
                      <TableCell>{f.numero_factura}</TableCell>
                      <TableCell>Pedido #{f.pedido}</TableCell>

                      <TableCell>
                        ${parseFloat(f.subtotal).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        ${parseFloat(f.impuestos).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <b>${parseFloat(f.total).toLocaleString()}</b>
                      </TableCell>

                      <TableCell>
                        {new Date(f.fecha).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
}
