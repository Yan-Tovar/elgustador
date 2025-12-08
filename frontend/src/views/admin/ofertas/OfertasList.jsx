import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { fetchOfertas, deleteOferta } from "../../../services/ofertasService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OfertasList() {
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadOfertas = async () => {
    try {
      const res = await fetchOfertas();
      setOfertas(res.data);
    } catch (error) {
      console.error("Error cargando ofertas", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta oferta?")) return;

    try {
      await deleteOferta(id);
      loadOfertas();
    } catch (error) {
      console.error("Error eliminando oferta", error);
    }
  };

  useEffect(() => {
    loadOfertas();
  }, []);

  return (
    <DashboardLayout>
      {/* HEADER */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h4">Ofertas</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/ofertas/nuevo")}
        >
          Nueva Oferta
        </Button>
      </Box>

      {/* TABLA */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          {!isMobile && (
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Descuento</strong></TableCell>
                <TableCell><strong>Inicio</strong></TableCell>
                <TableCell><strong>Fin</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {ofertas.map((oferta) => (
              <TableRow key={oferta.id}>
                <TableCell colSpan={isMobile ? 6 : 1}>
                  <Typography fontWeight={600}>
                    {oferta.nombre}
                  </Typography>

                  {isMobile && (
                    <>
                      <Typography variant="body2" mt={0.5}>
                        Descuento:{" "}
                        {oferta.descuento_porcentaje
                          ? `${oferta.descuento_porcentaje}%`
                          : `$${oferta.descuento_valor}`}
                      </Typography>

                      <Typography variant="body2">
                        Desde:{" "}
                        {new Date(oferta.fecha_inicio).toLocaleString()}
                      </Typography>

                      <Typography variant="body2">
                        Hasta:{" "}
                        {new Date(oferta.fecha_fin).toLocaleString()}
                      </Typography>

                      <Chip
                        label={oferta.estado ? "Activa" : "Inactiva"}
                        color={oferta.estado ? "success" : "default"}
                        size="small"
                        sx={{ mt: 1 }}
                      />

                      <Stack direction="row" spacing={1} mt={1}>
                        {/* EDITAR */}
                        <Button
                          size="small"
                          variant="outlined"
                          color="text"
                          onClick={() =>
                            navigate(`/admin/ofertas/${oferta.id}/editar`)
                          }
                          startIcon={!isMobile && <EditIcon />}
                          sx={{
                            minWidth: isMobile ? 36 : "auto",
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          {!isMobile && "Editar"}
                          {isMobile && <EditIcon />}
                        </Button>

                        {/* ELIMINAR */}
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDelete(oferta.id)}
                          startIcon={!isMobile && <DeleteIcon />}
                          sx={{
                            minWidth: isMobile ? 36 : "auto",
                            px: isMobile ? 1 : 2,
                          }}
                        >
                          {!isMobile && "Eliminar"}
                          {isMobile && <DeleteIcon />}
                        </Button>
                      </Stack>
                    </>
                  )}
                </TableCell>

                {!isMobile && (
                  <>
                    <TableCell>
                      {oferta.descuento_porcentaje
                        ? `${oferta.descuento_porcentaje}%`
                        : `$${oferta.descuento_valor}`}
                    </TableCell>

                    <TableCell>
                      {new Date(oferta.fecha_inicio).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {new Date(oferta.fecha_fin).toLocaleString()}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={oferta.estado ? "Activa" : "Inactiva"}
                        color={oferta.estado ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          color="text"
                          onClick={() =>
                            navigate(`/admin/ofertas/${oferta.id}/editar`)
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDelete(oferta.id)}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
}
