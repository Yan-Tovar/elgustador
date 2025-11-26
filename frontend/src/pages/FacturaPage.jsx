import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getFactura, descargarFacturaPDF, enviarFacturaEmail } from "../services/facturasService";
import { getPedido, fetchPedidoDetalle } from "../services/pedidosService";

import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from "@mui/material";

export default function FacturaPage() {
  const { facturaId } = useParams();

  const [factura, setFactura] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [detallePedido, setDetallePedido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviandoId, setEnviandoId] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1️⃣ Cargar factura
        const resFactura = await getFactura(facturaId);
        setFactura(resFactura.data);

        const pedidoId = resFactura.data.pedido;

        // 2️⃣ Cargar pedido
        const resPedido = await getPedido(pedidoId);
        setPedido(resPedido.data);

        // 3️⃣ Cargar detalle del pedido
        const resDetalle = await fetchPedidoDetalle(pedidoId);
        setDetallePedido(resDetalle);
      } catch (err) {
        console.error("Error cargando información:", err);
      }

      setLoading(false);
    };

    cargarDatos();
  }, [facturaId]);

  const handleDescargar = async (facturaId) => {
    try {
      const response = await descargarFacturaPDF(facturaId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `factura_${facturaId}.pdf`);
    } catch (error) {
      console.error("Error descargando factura:", error);
      alert("Hubo un error al descargar la factura.");
    }
  };

  const handleEnviarCorreo = async (facturaId) => {
    try {
      setEnviandoId(facturaId); // ➤ Deshabilita solo el botón de esta factura

      await enviarFacturaEmail(facturaId);

      alert("Factura enviada al correo.");
    } catch (error) {
      console.error("Error enviando factura:", error);
      alert("No se pudo enviar la factura por correo.");
    } finally {
      setEnviandoId(null); // ➤ Reactiva el botón
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <Box p={4} textAlign="center">
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando factura...</Typography>
        </Box>
      </DashboardLayout>
    );

  if (!factura)
    return (
      <DashboardLayout>
        <Box p={4}>
          <Typography color="error">Factura no encontrada.</Typography>
        </Box>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <Box p={4}>

        {/* ------------------------------- */}
        {/* SECCIÓN: FACTURA */}
        {/* ------------------------------- */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Factura #{factura.numero_factura}
          </Typography>

          <Typography sx={{ mt: 1 }}>Total: <b>${factura.total}</b></Typography>
          <Typography>Método de pago: {factura.metodo_pago}</Typography>
          <Typography>Fecha: {new Date(factura.fecha).toLocaleString()}</Typography>

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
        </Paper>

        {/* ------------------------------- */}
        {/* SECCIÓN: PEDIDO */}
        {/* ------------------------------- */}
        {pedido && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">Pedido #{pedido.id}</Typography>

            <Typography>Estado: {pedido.estado}</Typography>
            <Typography>Subtotal: ${pedido.subtotal}</Typography>
            <Typography>Envío: ${pedido.costo_envio}</Typography>
            <Typography>Total pedido: <b>${pedido.total}</b></Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Datos de envío</Typography>
            <Typography>{pedido.direccion_detallada}</Typography>
            <Typography>{pedido.municipio_nombre}, {pedido.departamento_nombre}</Typography>
          </Paper>
        )}

        {/* ------------------------------- */}
        {/* 🛒 SECCIÓN: DETALLE DEL PEDIDO */}
        {/* ------------------------------- */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Detalle del pedido
          </Typography>

          {detallePedido.length === 0 ? (
            <Typography>No hay detalles para este pedido.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio unitario</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {detallePedido.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.producto_nombre}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>${item.precio_unitario}</TableCell>
                    <TableCell>${item.precio_total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
