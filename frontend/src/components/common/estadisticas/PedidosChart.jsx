// src/pages/admin/PedidosChart.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import EChartsReact from "echarts-for-react";
import { format, subDays } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DownloadIcon from "@mui/icons-material/Download";
import GetAppIcon from "@mui/icons-material/GetApp";

import { fetchPedidosStats } from "../../../services/pedidosService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ESTADOS_ORDER = ["pendiente", "procesando", "pagado", "enviado", "entregado", "cancelado"];

export default function PedidosChart() {
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sd = startDate ? format(startDate, "yyyy-MM-dd") : null;
        const ed = endDate ? format(endDate, "yyyy-MM-dd") : null;
        const data = await fetchPedidosStats(sd, ed);
        setRawData(data);
      } catch (err) {
        console.error("Error cargando stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  // =====================
  // SERIES Y EJE
  // =====================
  const { dates, series, legend } = useMemo(() => {
    const dateSet = new Set();
    rawData.forEach((r) => dateSet.add(r.date));

    const datesArr = Array.from(dateSet).sort();

    const allDates = [];
    if (startDate && endDate) {
      const d = new Date(startDate);
      while (d <= endDate) {
        allDates.push(format(d, "yyyy-MM-dd"));
        d.setDate(d.getDate() + 1);
      }
    } else {
      allDates.push(...datesArr);
    }

    const estadoToCounts = {};
    ESTADOS_ORDER.forEach((e) => (estadoToCounts[e] = allDates.map(() => 0)));

    rawData.forEach((r) => {
      const idx = allDates.indexOf(r.date);
      if (idx === -1) return;
      estadoToCounts[r.estado][idx] = r.count;
    });

    const seriesArr = ESTADOS_ORDER.map((estado) => ({
      name: estado,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: estadoToCounts[estado],
    }));

    return { dates: allDates, series: seriesArr, legend: ESTADOS_ORDER };
  }, [rawData, startDate, endDate]);

  const option = useMemo(
    () => ({
      title: { text: "Pedidos por Estado y Fecha", left: "center" },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { top: 30, data: legend },
      grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
      xAxis: [{ type: "category", data: dates, name: "Fecha" }],
      yAxis: [{ type: "value", name: "Cantidad" }],
      series,
    }),
    [dates, series, legend]
  );

  // =====================
  // EXPORTAR EXCEL
  // =====================
  const handleExportExcel = () => {
    const header = ["estado", ...dates];
    const rows = ESTADOS_ORDER.map((estado) => {
      const row = [estado];
      const estadoCounts = series.find((s) => s.name === estado)?.data ?? dates.map(() => 0);
      return row.concat(estadoCounts);
    });

    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    XLSX.writeFile(wb, `pedidos_stats_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`);
  };

  // =====================
  // EXPORTAR PDF
  // =====================
  const handleExportPDF = async () => {
    try {
      let dataURL =
        chartRef.current?.getEchartsInstance()?.getDataURL({
          pixelRatio: 2,
          backgroundColor: "#fff",
        }) || null;

      if (!dataURL) {
        const chartDom = chartRef.current?.getEchartsInstance()?.getDom();
        const canvas = await html2canvas(chartDom, { scale: 2 });
        dataURL = canvas.toDataURL("image/png");
      }

      const pdf = new jsPDF("landscape", "pt", "a4");
      const imgProps = pdf.getImageProperties(dataURL);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataURL, "PNG", 0, 20, pdfWidth, pdfHeight);
      pdf.save(`pedidos_chart_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`);
    } catch (err) {
      console.error("Error exportando pdf", err);
    }
  };

  // =========================================================
  //            TEMPLADO RESPONSIVE + SCROLL INTERNO
  // =========================================================
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" mb={2} fontWeight="bold">
        Estadísticas de Pedidos
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* Fecha inicio */}
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              format="dd/MM/yyyy"
              label="Fecha inicio"
              value={startDate}
              onChange={(newVal) => setStartDate(newVal)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          {/* Fecha fin */}
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              format="dd/MM/yyyy"
              label="Fecha fin"
              value={endDate}
              onChange={(newVal) => setEndDate(newVal)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          {/* Botones */}
          <Grid
            item
            xs={12}
            sm={4}
            md={6}
            sx={{
              textAlign: { xs: "center", sm: "right" },
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Button
              variant="contained"
              startIcon={<GetAppIcon />}
              sx={{ mr: { sm: 1 }, mb: { xs: 1, sm: 0 } }}
              onClick={handleExportExcel}
            >
              Excel
            </Button>
            <Button
              variant="outlined"
              color="text"
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
            >
              PDF
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            overflowX: "auto", // SCROLL HORIZONTAL EN MÓVILES
            overflowY: "hidden",
            pb: 1,
          }}
        >
          <Box sx={{ minWidth: "700px" }}>
            <EChartsReact
              ref={chartRef}
              option={option}
              style={{
                height: "420px",
                width: "100%",
              }}
              notMerge
              lazyUpdate
            />
          </Box>
        </Box>
      )}
    </Paper>
  );
}
