// src/views/admin/productos/ProductosList.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Tooltip,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";
import { useNavigate } from "react-router-dom";

// Servicios
import {
  fetchProductos,
  searchProductos,
} from "../../../services/productosService";

export default function ProductosList() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const totalProductos = productos.length;
  const [search, setSearch] = useState("");

  // -------------------------
  // Cargar productos
  // -------------------------
  const loadProductos = async () => {
    try {
      const res = await fetchProductos();
      setProductos(res.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  // -------------------------
  // Buscar productos
  // -------------------------
  const buscar = async (texto) => {
    try {
      const res = await searchProductos(texto);
      setProductos(res.data);
    } catch (error) {
      console.error("Error buscando productos:", error);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  // Debounce búsqueda
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") loadProductos();
      else buscar(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // Helper de imagen
  const getImagenUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400";
    if (img.startsWith("http")) return img;  
    return `http://127.0.0.1:8000${img}`;
  };

  const th = {
  padding: "12px 14px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "14px",
  color: "#333",
  borderBottom: "2px solid #ddd",
};

const td = {
  padding: "10px 14px",
  fontSize: "14px",
};

const tdCenter = {
  ...td,
  textAlign: "center",
};


  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Productos
        </Typography>

        

        <TwoColumnInnerLayout
          left={
            <Box>

              {/* BUSCADOR */}
              <TextField
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* ============================== */}
              {/* TABLA CON SCROLL HORIZONTAL   */}
              {/* ============================== */}
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  borderRadius: 2,
                  border: "1px solid #ddd",
                  boxShadow: 1,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth: "900px",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f4f4f4" }}>
                      <th style={th}>ID</th>
                      <th style={th}>Imagen</th>
                      <th style={th}>Nombre</th>
                      <th style={th}>Precio</th>
                      <th style={th}>Stock</th>
                      <th style={th}>Categoría</th>
                      <th style={th}>Estado</th>
                      <th style={th}>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productos.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={tdCenter}>{prod.id}</td>

                        {/* Imagen */}
                        <td style={tdCenter}>
                          <img
                            src={getImagenUrl(prod.imagen1)}
                            alt={prod.nombre}
                            width="55"
                            height="55"
                            style={{
                              objectFit: "contain",
                              borderRadius: "6px",
                              background: "#fff",
                            }}
                          />
                        </td>

                        {/* Nombre */}
                        <td style={{ ...td, maxWidth: 180 }}>
                          <Tooltip title={prod.nombre}>
                            <span
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "block",
                              }}
                            >
                              {prod.nombre}
                            </span>
                          </Tooltip>
                        </td>

                        {/* Precio */}
                        <td style={tdCenter}>
                          <b>${prod.precio}</b>
                          {prod.precio_anterior && (
                            <span style={{ textDecoration: "line-through", color: "gray", marginLeft: 4 }}>
                              ${prod.precio_anterior}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td style={tdCenter}>
                          {prod.stock ?? (
                            <span style={{ color: "gray" }}>—</span>
                          )}
                        </td>

                        {/* Categoría */}
                        <td style={tdCenter}>
                          {prod.categoria_nombre ?? "Sin categoría"}
                        </td>

                        {/* Estado */}
                        <td style={tdCenter}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontWeight: "bold",
                              color: "#fff",
                              background: prod.estado ? "green" : "red",
                            }}
                          >
                            {prod.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td style={tdCenter}>
                          <Stack direction="row" spacing={1} justifyContent="center">

                            {/* Ver Detalle */}
                            <Button
                              size="small"
                              color="info"
                              variant="outlined"
                              onClick={() => navigate(`/admin/productos/${prod.id}`)}
                            >
                              Ver
                            </Button>

                            {/* Editar */}
                            <Button
                              size="small"
                              color="secondary"
                              variant="contained"
                              onClick={() => navigate(`/admin/productos/${prod.id}/editar`)}
                            >
                              Editar
                            </Button>

                            {/* Eliminar */}
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => navigate(`/admin/productos/${prod.id}/eliminar`)}
                            >
                              Eliminar
                            </Button>

                          </Stack>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
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
                Panel Productos
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                Total de productos: <strong>{totalProductos}</strong>
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
                  onClick={() => navigate("/admin/productos/nuevo")}
                >
                  Crear Producto
                </Button>
              </Box>
            </Box>
          }
        />
      </Box>
    </DashboardLayout>
  );
}
