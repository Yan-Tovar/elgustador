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

// ⬅ IMPORT SWEETALERT CORRECTO
import {
  showAlert,
  showToast,
  showConfirm,
} from "../components/feedback/SweetAlert";

export default function FacturaPage() {
  const { facturaId } = useParams();

  const [factura, setFactura] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [detallePedido, setDetallePedido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enviandoId, setEnviandoId] = useState(null);

  // -------------------------
  // CARGA INICIAL
  // -------------------------
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
        showAlert(
          "Error",
          "No se pudo cargar la información de la factura.",
          "error"
        );
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

      showToast("Descarga iniciada", "success");
    } catch (error) {
      console.error("Error descargando factura:", error);
      showAlert(
        "Error al descargar",
        "Hubo un error al descargar la factura.",
        "error"
      );
    }
  };

  const handleEnviarCorreo = async (id) => {
    try {
      // Confirmación antes de enviar
      const confirmado = await showConfirm(
        "Enviar factura",
        "¿Deseas enviar la factura al correo del cliente?"
      );

      if (!confirmado) return;

      setEnviandoId(id);
      await enviarFacturaEmail(id);

      showToast("Factura enviada correctamente", "success");
    } catch (error) {
      console.error("Error enviando factura:", error);
      showAlert(
        "Error al enviar",
        "No se pudo enviar la factura por correo.",
        "error"
      );
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%"
          }}
        >
          <Typography variant="h5"  fontWeight="bold">
            Detalle de tu Factura
          </Typography>
        </Box>
        <TwoColumnInnerLayout
          left={
            <Box>
              <FacturaInfo
                factura={factura}
                enviandoId={enviandoId}
                onDescargar={handleDescargar}
                onEnviarCorreo={handleEnviarCorreo}
              />
            </Box>
          }
          right={
            <Box>{pedido && <PedidoInfo pedido={pedido} />}</Box>
          }
        />
        <DetallePedidoTabla detalle={detallePedido} />
      </Box>
    </DashboardLayout>
  );
}
