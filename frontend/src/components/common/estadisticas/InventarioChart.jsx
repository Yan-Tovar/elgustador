import { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { fetchInventarioEstadisticas, fetchInventarioReportes } from "../../../services/productosService";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InventarioChart() {
  const [stats, setStats] = useState(null);
  const [reportes, setReportes] = useState(null);

  useEffect(() => {
    fetchInventarioEstadisticas().then(res => setStats(res.data));
    fetchInventarioReportes().then(res => setReportes(res.data));
  }, []);

  if (!stats || !reportes)
    return (
      <Typography sx={{ textAlign: "center", mt: 4, fontSize: 18 }}>
        Cargando estadísticas...
      </Typography>
    );

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([ { ...stats, ...reportes } ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Inventario");
    XLSX.writeFile(workbook, "inventario.xlsx");
  };

  const downloadPDF = async () => {
    const input = document.getElementById("inventario-reporte");

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("inventario.pdf");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Estadísticas del Inventario
      </Typography>

      <Grid container spacing={2} id="inventario-reporte">
        
        {/* Total productos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Total Productos</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              {stats.total_productos}
            </Typography>
          </Card>
        </Grid>

        {/* Activos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Activos</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              {stats.activos}
            </Typography>
          </Card>
        </Grid>

        {/* Inactivos */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Inactivos</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              {stats.inactivos}
            </Typography>
          </Card>
        </Grid>

        {/* Stock total */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Stock Total</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              {stats.stock_total}
            </Typography>
          </Card>
        </Grid>

        {/* Stock bajo */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Stock Bajo (≤5)</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              {stats.stock_bajo}
            </Typography>
          </Card>
        </Grid>

        {/* Sin stock */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Sin Stock</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
              {stats.sin_stock}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Botones de descarga */}
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={downloadExcel}>
          Descargar Excel
        </Button>
        <Button variant="outlined" onClick={downloadPDF}>
          Descargar PDF
        </Button>
      </Box>
    </Box>
  );
}
