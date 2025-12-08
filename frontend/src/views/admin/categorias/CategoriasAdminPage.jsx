import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';

import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from '../../../components/layout/DashboardLayout';
import TwoColumnInnerLayout from '../../../components/layout/TwoColumnInnerLayout';

import CategoriaCreateModal from './CategoriaCreateModal';
import CategoriaEditModal from './CategoriaEditModal';

import {
  fetchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../../../services/categoriasService';

import { showConfirm, showToast } from '../../../components/feedback/SweetAlert';

// IMPORTAMOS LA TABLA NUEVA
import CategoriaTable from "./CategoriaTable";

export default function CategoriasAdminPage() {

  const [categorias, setCategorias] = useState([]);
  const totalCategorias = categorias.length;

  const [categoriasOriginal, setCategoriasOriginal] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchCategorias();
      setCategorias(res.data);
      setCategoriasOriginal(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Error cargando categorías',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Búsqueda con debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") {
        setCategorias(categoriasOriginal);
      } else {
        const filtro = categoriasOriginal.filter(cat =>
          cat.nombre.toLowerCase().includes(search.toLowerCase())
        );
        setCategorias(filtro);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [search, categoriasOriginal]);

  const handleCreate = async (formData) => {
    try {
      await createCategoria(formData);
      setOpenCreate(false);
      await load();
      showToast('Categoría creada', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al crear', 'error');
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await updateCategoria(id, formData);
      setOpenEdit(false);
      setSelected(null);
      await load();
      showToast('Categoría actualizada', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al actualizar', 'error');
    }
  };

  const handleDelete = async (categoria) => {
    const ok = await showConfirm(
      `Eliminar ${categoria.nombre}?`,
      'Esta acción no se puede deshacer'
    );
    if (!ok) return;

    try {
      await deleteCategoria(categoria.id);
      await load();
      showToast('Categoría eliminada', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar', 'error');
    }
  };

  return (
    <DashboardLayout>

      <TwoColumnInnerLayout
        left={(
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
              Gestión de Categorias
            </Typography>
            {/* BUSCADOR */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Buscar categorías..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        )}

        right={(
          <Box
            sx={{
              p: 1,
              borderRadius: 3,
              bgcolor: "background.paper",
              textAlign: "center",
              boxShadow: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              Panel Categorías
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Total de categorías: <strong>{totalCategorias}</strong>
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              sx={{ px: 3, py: 1, borderRadius: 2, fontWeight: "bold" }}
              onClick={() => setOpenCreate(true)}
            >
              Crear Categoría
            </Button>
          </Box>
        )}
      />

      <Box sx={{ mt: 2 }}>
        {/* TABLA DE CATEGORÍAS */}
        <CategoriaTable
          categorias={categorias}
          search={search}
          setSearch={setSearch}
          onEdit={(cat) => { setSelected(cat); setOpenEdit(true); }}
          onDelete={(cat) => handleDelete(cat)}
        />

      </Box>

      {/* Modales */}
      <CategoriaCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
      />

      <CategoriaEditModal
        open={openEdit}
        categoria={selected}
        onClose={() => { setOpenEdit(false); setSelected(null); }}
        onUpdate={handleUpdate}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

    </DashboardLayout>
  );
}
