// components/municipios/MunicipioList.jsx

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

export default function MunicipioList({ municipios, onEdit, onDelete }) {
  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",

          //  Hacer el contenedor scrolleable
          overflowX: "auto",

          //  Para que funcione en Safari iOS / Android
          WebkitOverflowScrolling: "touch",

          //  MUY IMPORTANTE
          display: "block",
        }}
      >
        <Table
          stickyHeader

          //  Ancho mínimo para que nunca colapse
          sx={{
            minWidth: 700, // puedes subirlo si tienes más columnas
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell><Typography fontWeight="bold">Nombre</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Departamento</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Costo de Envío</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Estado</Typography></TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold">Acciones</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {municipios.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell>
                  <Typography fontWeight="600">{m.nombre}</Typography>
                </TableCell>

                <TableCell>
                  <Typography>{m.departamento?.nombre}</Typography>
                </TableCell>

                <TableCell>
                  <Typography>{m.costo_envio}</Typography>
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {m.estado ? (
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
                  <IconButton onClick={() => onEdit(m)} color="text">
                    <Edit />
                  </IconButton>

                  <IconButton onClick={() => onDelete(m.id)} color="error">
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
