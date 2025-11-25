import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DasboardLayout from "../components/layout/DashboardLayout"
import { getFactura } from "../services/facturasService";
import { Box, Typography } from "@mui/material";

export default function FacturaPage() {
  const { facturaId } = useParams();
  const [factura, setFactura] = useState(null);

  useEffect(() => {
    getFactura(facturaId).then((res) => setFactura(res.data));
  }, [facturaId]);

  if (!factura) return <p>Cargando...</p>;

  return (
    <DasboardLayout>
      <Box p={4}>
        <Typography variant="h4">Factura #{factura.numero_factura}</Typography>
        <Typography>Total: ${factura.total}</Typography>
        <a href={factura.url_pdf} target="_blank">Descargar PDF</a>
      </Box>
    </DasboardLayout>
  );
}
