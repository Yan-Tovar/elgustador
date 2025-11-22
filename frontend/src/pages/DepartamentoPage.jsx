// pages/DepartamentoPage.jsx
import { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";
import DepartamentoList from "../components/departamentos/DepartamentoList";
import DepartamentoForm from "../components/departamentos/DepartamentoForm";
import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
} from "../services/DepartamentoService";

export default function DepartamentoPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchDepartamentos = async () => {
    const res = await getDepartamentos();
    setDepartamentos(res.data);
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (departamento) => {
    setEditing(departamento);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este departamento?")) {
      await deleteDepartamento(id);
      await fetchDepartamentos();
    }
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await updateDepartamento(editing.id, data);
    } else {
      await createDepartamento(data);
    }

    setOpen(false);
    fetchDepartamentos();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Gestión de Departamentos
      </Typography>

      <Button variant="contained" onClick={handleCreate}>
        + Crear Departamento
      </Button>

      <DepartamentoList
        departamentos={departamentos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogContent>
          <DepartamentoForm
            onSubmit={handleSubmit}
            initialData={editing}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
