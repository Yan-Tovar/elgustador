import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../components/layout/TwoColumnInnerLayout";

import {
  getFactura,
  descargarFacturaPDF,
  enviarFacturaEmail,
} from "../services/facturasService";

import { getPedido, fetchPedidoDetalle } from "../services/pedidosService";

import { Box, CircularProgress, Typography } from "@mui/material";

// Componentes hijos
import FacturaInfo from "../components/common/facturas/FacturaInfo";
import PedidoInfo from "../components/common/facturas/PedidoInfo";
import DetallePedidoTabla from "../components/common/facturas/DetallePedidoTabla";

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
        const resFactura = await getFactura(facturaId);
        setFactura(resFactura.data);

        const pedidoId = resFactura.data.pedido;

        const resPedido = await getPedido(pedidoId);
        setPedido(resPedido.data);

        const resDetalle = await fetchPedidoDetalle(pedidoId);
        setDetallePedido(resDetalle);
      } catch (err) {
        console.error("Error cargando información:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [facturaId]);

  // -------------------------
  // ACCIONES
  // -------------------------
  const handleDescargar = async (id) => {
    try {
      const response = await descargarFacturaPDF(id);
      const blob = new Blob([response.data], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `factura_${id}.pdf`;
      link.click();
    } catch (error) {
      console.error("Error descargando factura:", error);
      alert("Hubo un error al descargar la factura.");
    }
  };

  const handleEnviarCorreo = async (id) => {
    try {
      setEnviandoId(id);
      await enviarFacturaEmail(id);
      alert("Factura enviada al correo.");
    } catch (error) {
      console.error("Error enviando factura:", error);
      alert("No se pudo enviar la factura por correo.");
    } finally {
      setEnviandoId(null);
    }
  };

  // -------------------------
  // ESTADOS DE CARGA Y ERROR
  // -------------------------
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

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <DashboardLayout>
      <Box p={4}>
        <TwoColumnInnerLayout
          left={
            <Box>
              {/* FACTURA */}
              <FacturaInfo
                factura={factura}
                enviandoId={enviandoId}
                onDescargar={handleDescargar}
                onEnviarCorreo={handleEnviarCorreo}
              />
              <DetallePedidoTabla detalle={detallePedido} />
            </Box>
          }
          right={
            <Box>
              {/* PEDIDO */}
              {pedido && <PedidoInfo pedido={pedido} />}
            </Box>
          }
        />
      </Box>
    </DashboardLayout>
  );
}
