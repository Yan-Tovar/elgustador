// src/components/common/carrusel/CarruselListadoTabla.jsx
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getImagenUrl } from "../../../services/carruselService";

export default function CarruselListadoTabla({
  items,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
}) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.rol === "admin";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box width="100%">
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          {!isMobile && (
            <TableHead>
              <TableRow>
                <TableCell><strong>Imagen</strong></TableCell>
                <TableCell><strong>Título</strong></TableCell>
                <TableCell><strong>Descripción</strong></TableCell>
                <TableCell><strong>Enlace</strong></TableCell>
                {isAdmin && <TableCell align="center"><strong>Acciones</strong></TableCell>}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                {/* IMAGEN */}
                <TableCell sx={{ width: isMobile ? "100%" : 120 }}>
                  <Box
                    component="img"
                    src={getImagenUrl(item.imagen)}
                    alt={item.titulo}
                    sx={{
                      width: isMobile ? "100%" : 100,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                  />
                </TableCell>

                {/* CONTENIDO */}
                <TableCell colSpan={isMobile ? 4 : 1}>
                  <Typography fontWeight={600}>
                    {item.titulo}
                  </Typography>

                  {item.descripcion && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {item.descripcion}
                    </Typography>
                  )}

                  {item.url_destino && (
                    <Link
                      href={item.url_destino}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: "inline-block", mt: 0.5 }}
                    >
                      Ir al enlace →
                    </Link>
                  )}

                  {/* ACCIONES EN MÓVIL */}
                  {isMobile && isAdmin && (
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onEdit(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => onDelete(item.id)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  )}
                </TableCell>

                {/* ACCIONES DESKTOP */}
                {!isMobile && isAdmin && (
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onEdit(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={() => onDelete(item.id)}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      {hasMore && isAdmin && (
        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={onLoadMore}>
            Cargar más
          </Button>
        </Box>
      )}
    </Box>
  );
}
