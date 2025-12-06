import React from "react";
import {
  Box,
  Button,
  Stack,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoDisturbOn from "@mui/icons-material/DoDisturbOn";

export default function CategoriaTable({
  categorias,
  search,
  setSearch,
  onEdit,
  onDelete,
}) {
  const th = {
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "10px",
    borderBottom: "1px solid #eee",
  };

  const tdCenter = {
    ...td,
    textAlign: "center",
  };

  const getImagenUrl = (img) => {
    if (!img) return "/default_categoria.png";
    if (img.startsWith("http")) return img;
    return `http://127.0.0.1:8000${img}`;
  };

  return (
    <Box>
      {/* TABLA */}
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 2,
          border: "1px solid #ddd",
          boxShadow: 1,
          mt: 2,
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
              <th style={th}>Descripción</th>
              <th style={th}>Fecha creación</th>
              <th style={th}>Estado</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td style={tdCenter}>{cat.id}</td>

                <td style={tdCenter}>
                  <img
                    src={getImagenUrl(cat.imagen)}
                    alt={cat.nombre}
                    width="55"
                    height="55"
                    style={{
                      objectFit: "contain",
                      borderRadius: "6px",
                      background: "#fff",
                    }}
                  />
                </td>

                <td style={{ ...td, maxWidth: 180 }}>
                  <Tooltip title={cat.nombre}>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {cat.nombre}
                    </span>
                  </Tooltip>
                </td>

                <td style={{ ...td, maxWidth: 280 }}>
                  <Tooltip title={cat.descripcion}>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {cat.descripcion || "Sin descripción"}
                    </span>
                  </Tooltip>
                </td>

                <td style={tdCenter}>
                  {cat.fecha_creacion
                    ? new Date(cat.fecha_creacion).toLocaleDateString()
                    : "—"}
                </td>

                <td style={tdCenter}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      color: "#fff",
                      background: cat.estado ? "green" : "red",
                    }}
                  >
                    {cat.estado ? "Activa" : "Inactiva"}
                  </span>
                </td>

                <td style={tdCenter}>
                  <Stack direction="row" spacing={1} justifyContent="center">

                    {/* Editar */}
                    <Button
                      size="small"
                      color="secondary"
                      variant="contained"
                      onClick={() => onEdit(cat)}
                    >
                      <EditIcon />
                    </Button>

                    {/* Eliminar */}
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => onDelete(cat)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
