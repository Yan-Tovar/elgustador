// pages/MunicipioPage.jsx
import { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogContent, TextField } from "@mui/material";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";

import MunicipioList from "./MunicipioList";
import MunicipioForm from "./MunicipioForm";

import {
  getMunicipios,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
  buscarMunicipios,
} from "../../../services/MunicipioService";

import { showConfirm, showAlert, showToast } from "../../../components/feedback/SweetAlert";

export default function MunicipioPage() {
  const [municipios, setMunicipios] = useState([]);
  const totalMunicipios = municipios.length;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [search, setSearch] = useState("");

  const fetchMunicipios = async () => {
    const res = await getMunicipios();
    setMunicipios(res.data);
  };

  useEffect(() => {
    fetchMunicipios();
  }, []);

  // 🔍 Buscar automáticamente
  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      fetchMunicipios();
      return;
    }

    const res = await buscarMunicipios({ nombre: value });
    setMunicipios(res);
  };

  const handleCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (municipio) => {
    setEditing(municipio);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm(
      "Eliminar Municipio",
      "¿Estás seguro de eliminar este municipio?"
    );

    if (!confirmed) return;

    await deleteMunicipio(id);
    showToast("Municipio eliminado");

    fetchMunicipios();
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await updateMunicipio(editing.id, data);
      showAlert("Actualizado", "Municipio actualizado con éxito", "success");
    } else {
      await createMunicipio(data);
      showAlert("Creado", "Municipio creado con éxito", "success");
    }

    setOpen(false);
    fetchMunicipios();
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>

        <TwoColumnInnerLayout
          left={
            <Box>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Gestión de Municipios
              </Typography>
              <TextField
                color="secondary"
                label="Buscar municipio..."
                variant="outlined"
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
                Panel Municipios
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                Total de municipios: <strong>{totalMunicipios}</strong>
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
                  Crear Municipio
                </Button>
              </Box>
            </Box>
          }
          
        />

        <Box sx={{mt: 2}}>
          <MunicipioList
            municipios={municipios}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogContent>
            <MunicipioForm
              onSubmit={handleSubmit}
              initialData={editing}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}
