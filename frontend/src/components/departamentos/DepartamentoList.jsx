// components/departamentos/DepartamentoList.jsx
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DepartamentoList({ departamentos, onEdit, onDelete }) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Nombre</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
            <TableCell><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {departamentos.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.id}</TableCell>
              <TableCell>{d.nombre}</TableCell>
              <TableCell>{d.estado ? "Activo" : "Inactivo"}</TableCell>

              <TableCell>
                <IconButton color="primary" onClick={() => onEdit(d)}>
                  <EditIcon />
                </IconButton>

                <IconButton color="error" onClick={() => onDelete(d.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
