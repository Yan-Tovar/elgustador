// components/departamentos/DepartamentoList.jsx
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";

import { CheckCircle, Cancel, Edit, Delete } from "@mui/icons-material";

export default function DepartamentoList({ departamentos, onEdit, onDelete }) {
  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          maxHeight: 500, // Si quieres limitar altura
          overflowX: "auto", // Scroll horizontal si es muy ancha
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight="bold">Nombre</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Estado</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">Acciones</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {departamentos.map((d) => (
              <TableRow key={d.id} hover>
                <TableCell>
                  <Typography fontWeight="600">{d.nombre}</Typography>
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {d.estado ? (
                      <>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography color="green">Activo</Typography>
                      </>
                    ) : (
                      <>
                        <Cancel color="error" fontSize="small" />
                        <Typography color="error">Inactivo</Typography>
                      </>
                    )}
                  </Stack>
                </TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => onEdit(d)} color="text">
                    <Edit />
                  </IconButton>

                  <IconButton onClick={() => onDelete(d.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
