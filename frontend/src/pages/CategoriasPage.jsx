import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from "../components/layout/DashboardLayout";

import { fetchCategorias } from "../services/categoriasService";

import CategoriaCard from "../components/common/CategoriaCard"; // ajusta si tu ruta es distinta

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  // 🔍 Efecto de búsqueda con debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") {
        loadCategorias();
      } else {
        handleSearch(search);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const loadCategorias = async () => {
    try {
      const res = await fetchCategorias();
      setCategorias(res.data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setSnackbar({
        open: true,
        message: "Error cargando categorías",
        severity: "error",
      });
    }
  };

  const handleSearch = async (texto) => {
    try {
      // 🔹 Filtrado en frontend (porque no definiste un endpoint search para categorías)
      const res = await fetchCategorias();
      const filtradas = res.data.filter((cat) =>
        cat.nombre.toLowerCase().includes(texto.toLowerCase())
      );
      setCategorias(filtradas);
    } catch (err) {
      console.error("Error buscando categorías:", err);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ padding: 1 }}>

        {/* BARRA DE BÚSQUEDA */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
              maxWidth: 400,
            }}
          />
        </Box>

        {/* LISTA DE CATEGORÍAS */}
        <Grid container spacing={2} justifyContent="center">
          {categorias.map((cat) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              key={cat.id}
              display="flex"
              justifyContent="center"
            >
              <CategoriaCard categoria={cat} />
            </Grid>
          ))}
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
}
