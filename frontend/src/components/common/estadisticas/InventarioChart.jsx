import { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import ReactECharts from "echarts-for-react";
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

  // ==========================
  // Funciones de descarga
  // ==========================
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet([{ ...stats, ...reportes }]);
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

  // ==========================
  // Opciones de ECharts
  // ==========================
  const stockOption = {
    title: { text: "Stock de Productos", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Stock Total", "Stock Bajo", "Sin Stock"]
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [stats.stock_total, stats.stock_bajo, stats.sin_stock],
        type: "bar",
        itemStyle: { color: "#1976d2" },
        barWidth: 40
      }
    ]
  };

  const estadoOption = {
    title: { text: "Estado de Productos", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Activos", "Inactivos"]
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [stats.activos, stats.inactivos],
        type: "bar",
        itemStyle: { color: "#388e3c" },
        barWidth: 40
      }
    ]
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Estadísticas del Inventario
      </Typography>

      {/* Indicadores rápidos */}
      <Box
        id="inventario-reporte"
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2
        }}
      >
        {[
          { label: "Total Productos", value: stats.total_productos },
          { label: "Activos", value: stats.activos },
          { label: "Inactivos", value: stats.inactivos },
          { label: "Stock Total", value: stats.stock_total },
          { label: "Stock Bajo (≤5)", value: stats.stock_bajo },
          { label: "Sin Stock", value: stats.sin_stock }
        ].map((item) => (
          <Card key={item.label} sx={{ minWidth: 150, flexShrink: 0, p: 2 }}>
            <Typography variant="subtitle1">{item.label}</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>{item.value}</Typography>
          </Card>
        ))}
      </Box>

      {/* Gráficos */}
      <Grid >
        <Grid >
          <Card>
            <CardContent>
              <ReactECharts option={stockOption} style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid >
          <Card>
            <CardContent>
              <ReactECharts option={estadoOption} style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botones de descarga */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" color="text" onClick={downloadExcel}>
          Descargar Estadística
        </Button>
        <Button variant="outlined" color="secondary" onClick={downloadPDF}>
          Descargar PDF
        </Button>
      </Stack>
    </Box>
  );
}
