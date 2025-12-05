// src/pages/CarruselAdminPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Swal from "sweetalert2";

import {
  fetchCarruselAdmin,
  createCarrusel,
  updateCarrusel,
  deleteCarrusel,
} from "../../../services/carruselService";

import CarruselListado from "../../../components/common/carrusel/CarruselListado";
import CarruselForm from "../../../components/common/carrusel/CarruselForm";

export default function CarruselAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // -------------------------------
  // Cargar datos
  // -------------------------------
  const cargarCarrusel = async (reset = false) => {
    try {
      const res = await fetchCarruselAdmin(page, 10);
      const nuevos = res.data.results || [];

      setItems((prev) => (reset ? nuevos : [...prev, ...nuevos]));
      setHasMore(res.data.has_more);

      setLoading(false);
    } catch (err) {
      console.error("Error cargando carrusel:", err);
      Swal.fire("Error", "No se pudo cargar el carrusel.", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCarrusel(true);
  }, []);

  useEffect(() => {
    if (page > 1) cargarCarrusel();
  }, [page]);

  // -------------------------------
  // Crear o Editar
  // -------------------------------
  const handleGuardar = async (data) => {
    try {
      if (editItem) {
        await updateCarrusel(editItem.id, data);
        Swal.fire("Actualizado", "El item fue actualizado correctamente", "success");
      } else {
        await createCarrusel(data);
        Swal.fire("Creado", "El item fue creado correctamente", "success");
      }

      setOpenForm(false);
      setEditItem(null);
      setItems([]);
      setPage(1);
      cargarCarrusel(true); // recargar
    } catch {
      Swal.fire("Error", "No se pudo guardar el item.", "error");
    }
  };

  // -------------------------------
  // Eliminar (soft delete)
  // -------------------------------
  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar item?",
      text: "El item será desactivado, no eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, desactivar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteCarrusel(id);
      Swal.fire("Desactivado", "El item ya no está visible.", "success");

      setItems([]);
      cargarCarrusel(true);
    } catch {
      Swal.fire("Error", "No se pudo eliminar.", "error");
    }
  };

  // -------------------------------
  // Loading
  // -------------------------------
  if (loading) {
    return (
      <DashboardLayout>
        <Box p={4} textAlign="center">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box p={4}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Gestión del Carrusel
          </Typography>

          <Button variant="contained" onClick={() => setOpenForm(true)}>
            Nuevo Item
          </Button>
        </Box>

        {/* LISTADO */}
        <CarruselListado
          items={items}
          onEdit={(item) => {
            setEditItem(item);
            setOpenForm(true);
          }}
          onDelete={handleEliminar}
          onLoadMore={() => setPage(page + 1)}
          hasMore={hasMore}
        />

        {/* FORMULARIO */}
        <CarruselForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setEditItem(null);
          }}
          initialData={editItem}
          onSubmit={handleGuardar}
        />
      </Box>
    </DashboardLayout>
  );
}
