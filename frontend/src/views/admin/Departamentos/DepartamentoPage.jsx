// pages/DepartamentoPage.jsx
import { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent, TextField } from "@mui/material";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";

import DepartamentoList from "./DepartamentoList";
import DepartamentoForm from "./DepartamentoForm";

import {
  getDepartamentos,
  createDepartamento,
  updateDepartamento,
  deleteDepartamento,
  buscarDepartamentos, 
} from "../../../services/DepartamentoService";

import { showConfirm, showAlert, showToast } from "../../../components/feedback/SweetAlert";

export default function DepartamentoPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const totalDepartamentos = departamentos.length;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");

  const fetchDepartamentos = async () => {
    const res = await getDepartamentos();
    setDepartamentos(res.data);
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  // Nueva función: buscar automáticamente
  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      fetchDepartamentos();
      return;
    }

    const res = await buscarDepartamentos({ nombre: value });
    setDepartamentos(res);
  };

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (departamento) => {
    setEditing(departamento);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm(
      "Eliminar Departamento",
      "¿Estás seguro de eliminar este departamento?"
    );

    if (!confirmed) return;

    await deleteDepartamento(id);
    showToast("Departamento eliminado");
    fetchDepartamentos();
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await updateDepartamento(editing.id, data);
      showAlert("Actualizado", "Departamento actualizado con éxito", "success");
    } else {
      await createDepartamento(data);
      showAlert("Creado", "Departamento creado con éxito", "success");
    }

    setOpen(false);
    fetchDepartamentos();
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <TwoColumnInnerLayout
          left={
            <Box>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Gestión de Departamentos
              </Typography>
              {/*  Barra de búsqueda */}
              <TextField
                label="Buscar departamento..."
                variant="outlined"
                color="secondary"
                fullWidth
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>
          }
          right={
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "background.paper",
                textAlign: "center",
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  mb: 1,
                }}
              >
                Panel Departamentos
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                Total de departamentos: <strong>{totalDepartamentos}</strong>
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: "bold",
                  }}
                  onClick={handleCreate}
                >
                  Crear Departamento
                </Button>
              </Box>
            </Box>
          }
        />

        <Box sx={{mt:2}}>
          <DepartamentoList
            departamentos={departamentos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogContent>
            <DepartamentoForm onSubmit={handleSubmit} initialData={editing} />
          </DialogContent>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
