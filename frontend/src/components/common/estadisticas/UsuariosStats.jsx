import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import { saveAs } from "file-saver";
import TwoColumnInnerLayout from "../../layout/TwoColumnInnerLayout";

// Servicios
import {
  fetchUsuariosPorRol,
  fetchUsuariosPorMes,
  fetchUsuariosEnSesion,
  exportUsuariosExcel,
} from "../../../services/usuariosService";

export default function UsuariosStats() {
  const theme = useTheme();

  const [porRol, setPorRol] = useState([]);
  const [porMes, setPorMes] = useState([]);
  const [enSesion, setEnSesion] = useState({ total_en_sesion: 0 });

  // ======================================
  // CARGAR ESTADÍSTICAS
  // ======================================
  const loadStats = async () => {
    try {
      const [rolRes, mesRes, sesionRes] = await Promise.all([
        fetchUsuariosPorRol(),
        fetchUsuariosPorMes(),
        fetchUsuariosEnSesion(),
      ]);

      setPorRol(rolRes.data);
      setPorMes(mesRes.data);
      setEnSesion(sesionRes.data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ======================================
  // OPCIONES ECHARTS
  // ======================================
  const getRolOption = () => ({
    title: { text: "Usuarios por Rol", left: "center" },
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
      {
        name: "Usuarios",
        type: "pie",
        radius: "50%",
        data: porRol.map((r) => ({ value: r.total, name: r.rol })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0,0,0,0.3)",
          },
        },
      },
    ],
  });

  const getMesOption = () => ({
    title: { text: "Usuarios Registrados por Mes", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: porMes.map((m) => m.mes) },
    yAxis: { type: "value" },
    series: [
      {
        data: porMes.map((m) => m.total),
        type: "line",
        smooth: true,
        areaStyle: {},
      },
    ],
  });

  const getSesionOption = () => {
    const dataArray = [
      { rol: "En sesión", total: enSesion.total_en_sesion || 0 },
    ];

    return {
      title: { text: "Usuarios en Sesión (últimos 30 min)", left: "center" },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: dataArray.map((u) => u.rol) },
      yAxis: { type: "value" },
      series: [
        {
          data: dataArray.map((u) => u.total),
          type: "bar",
          itemStyle: { color: theme.palette.primary.main },
        },
      ],
    };
  };

  // ======================================
  // EXPORTAR EXCEL
  // ======================================
  const handleExportExcel = async () => {
    try {
      const res = await exportUsuariosExcel();
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `usuarios_reporte.xlsx`);
    } catch (error) {
      console.error("Error exportando Excel:", error);
    }
  };

  return (
    <Box p={2}>
      <TwoColumnInnerLayout
        left={
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Estadísticas de Usuarios
            </Typography>
          </Box>
        }
        right={
          <Box>
            <Button variant="contained" color="secondary" onClick={handleExportExcel}>
              Descargar Excel
            </Button>
          </Box>
        }
      />

      {/* Contenedor horizontal scroll */}
      <Box
        display="flex"
        flexWrap="nowrap"
        overflow="auto"
        sx={{mb: 2}}
        gap={2}
      >
        <Box minWidth={350}>
          <Card>
            <CardContent sx={{ height: 400 }}>
              <ReactECharts option={getRolOption()} style={{ height: "100%" }} />
            </CardContent>
          </Card>
        </Box>
      </Box>
        {/* Contenedor horizontal scroll */}
      <Box
        display="flex"
        flexWrap="nowrap"
        overflow="auto"
        sx={{mb: 2}}
        gap={2}
      >

        <Box minWidth={350}>
          <Card>
            <CardContent sx={{ height: 400 }}>
              <ReactECharts option={getMesOption()} style={{ height: "100%" }} />
            </CardContent>
          </Card>
        </Box>
      </Box>
              {/* Contenedor horizontal scroll */}
      <Box
        display="flex"
        flexWrap="nowrap"
        overflow="auto"
        sx={{mb: 2}}
        gap={2}
      >

        <Box minWidth={350}>
          <Card>
            <CardContent sx={{ height: 400 }}>
              <ReactECharts option={getSesionOption()} style={{ height: "100%" }} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
