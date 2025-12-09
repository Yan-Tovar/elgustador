import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Tooltip,
  Stack,
  Modal,
  Card,
  CardContent,
  Grid,
  useTheme, 
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import TwoColumnInnerLayout from "../../../components/layout/TwoColumnInnerLayout";
import { exportTableExcel } from '../../../services/exportService';
import { showConfirm, showAlert } from "../../../components/feedback/SweetAlert";

// Servicios (ajústalos si cambia el nombre)
import {
  fetchUsuariosAdmin,
  updateUsuarioAdmin,
  exportUsuariosExcel
} from "../../../services/usuariosService";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 500 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
};

export default function UsuariosList() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [rolFiltro, setRolFiltro] = useState("todos");
  const totalUsuarios = usuarios.length;

  const [usuarioSelected, setUsuarioSelected] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ======================================
  // CARGAR USUARIOS
  // ======================================
  const loadUsuarios = async () => {
    try {
      const res = await fetchUsuariosAdmin({
        page: 1,
        rol: rolFiltro === "todos" ? "" : rolFiltro,
      });

      setUsuarios(res.data.results ?? res.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  // ======================================
  // BUSCAR USUARIOS
  // ======================================
  const buscar = async (texto = "") => {
    try {
      const res = await fetchUsuariosAdmin({
        page: 1,
        search: texto.trim(),
        rol: rolFiltro === "todos" ? "" : rolFiltro,
      });

      setUsuarios(res.data.results ?? res.data);
    } catch (error) {
      console.error("Error buscando usuarios:", error);
    }
  };

  // ======================================
  // DEBOUNCE BÚSQUEDA
  // ======================================
  useEffect(() => {
    const delay = setTimeout(() => {
      const texto = search.trim();

      if (texto === "") {
        loadUsuarios();
      } else {
        buscar(texto);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [search, rolFiltro]); 

  // ======================================
  // EDITAR USUARIO
  // ======================================
  const handleGuardarCambios = async () => {
    setOpenEditar(false);
    if (!usuarioSelected) return;

    const confirm = await showConfirm(
      "Confirmar cambio de rol",
      `¿Deseas cambiar el rol del usuario a "${usuarioSelected.rol}"?`
    );

    if (!confirm) return;

    try {
      await updateUsuarioAdmin(usuarioSelected.id, {
        rol: usuarioSelected.rol,
      });

      showAlert(
        "Rol actualizado",
        "El rol del usuario se actualizó correctamente",
        "success"
      );

      loadUsuarios();
      setOpenEditar(false);
      setUsuarioSelected(null);
    } catch (error) {
      console.error("Error actualizando usuario:", error);

      showAlert(
        "Error",
        "No se pudo actualizar el rol del usuario",
        "error"
      );
    }
  };

  // ======================================
  // EXPORTAR USUARIOS EXCEL
  // ======================================
  const handleExportExcel = async () => {
    try {
      const res = await exportUsuariosExcel({
        search: search.trim(),
        rol: rolFiltro === "todos" ? "" : rolFiltro,
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const fecha = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `reporte_usuarios_${fecha}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exportando usuarios:", error);
    }
  };

  // ======================================
  // ESTILOS TABLA
  // ======================================
  const th = {
    padding: "12px 14px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
    borderBottom: "2px solid #ddd",
  };

  const td = {
    padding: "10px 14px",
    fontSize: "14px",
    textAlign: "center",
  };

  const handleExport = () => {
    exportTableExcel("pedidos", "pedido");
  };

  return (
    <DashboardLayout>
      <Box>
        <TwoColumnInnerLayout
          left={
            <Box>
              <Box sx={{display: "flex", justifyContent: "center", mb: 1 }}>
                <Typography variant="h5" >
                  Usuarios
                </Typography>
              </Box>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ justifyContent: "center", mb:2 }}
              >
                {[
                  { label: "Todos", value: "todos", icon: <GroupIcon /> },
                  { label: "Clientes", value: "cliente", icon: <PersonIcon /> },
                  { label: "Empleados", value: "empleado", icon: <PeopleIcon /> },
                  { label: "Admins", value: "admin", icon: <AdminPanelSettingsIcon /> },
                ].map((btn) => {
                  const content = (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {btn.icon}
                      {!isMobile && btn.label}
                    </Stack>
                  );

                  return isMobile ? (
                    <Tooltip key={btn.value} title={btn.label}>
                      <Button
                        variant={rolFiltro === btn.value ? "contained" : "outlined"}
                        size="small"
                        color="secondary"
                        onClick={() => {
                          setRolFiltro(btn.value);
                        }}
                        sx={{
                          borderRadius: 3,
                          minWidth: 40,
                          padding: "6px 10px",
                        }}
                      >
                        {btn.icon}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      key={btn.value}
                      variant={rolFiltro === btn.value ? "contained" : "outlined"}
                      size="small"
                      color="secondary"
                      onClick={() => {
                        setRolFiltro(btn.value);
                      }}
                      sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        boxShadow:
                          rolFiltro === btn.value
                            ? "0px 2px 6px rgba(0,0,0,0.12)"
                            : "none",
                      }}
                    >
                      {content}
                    </Button>
                  );
                })}
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: "secondary"
                  }}
                  onClick={handleExport}
                >
                  Descargar Excel
                </Button>
              </Stack>

              <TextField
                placeholder="Buscar por ID, email o rol..."
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
            </Box>
          }
          right={
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "background.paper",
                boxShadow: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Panel Usuarios
              </Typography>

              <Typography sx={{ mt: 2 }}>
                Total de usuarios: <strong>{totalUsuarios}</strong>
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/admin/usuarios/estadisticas")}
              >
                Estadísticas
              </Button>
            </Box>
          }
        />

        {/* ============================= */}
        {/* TABLA RESPONSIVE              */}
        {/* ============================= */}
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
              <tr style={{ background: "primary" }}>
                <th style={th}>Identificacion</th>
                <th style={th}>Nombre</th>
                <th style={th}>Email</th>
                <th style={th}>Rol</th>
                <th style={th}>Estado</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{u.identificacion}</td>

                  <td style={{ ...td, maxWidth: 180 }}>
                    <Tooltip title={`${u.nombre} ${u.apellido}`}>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                        {u.nombre} {u.apellido}
                      </span>
                    </Tooltip>
                  </td>

                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.rol}</td>

                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        color: "#fff",
                        background: u.is_active ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {u.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td style={td}>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button size="small" variant="outlined" color="text" onClick={() => {
                        setUsuarioSelected(u);
                        setOpenDetalle(true);
                      }}>
                        Ver
                      </Button>

                      <Button size="small" variant="contained" color="secondary" onClick={() => {
                        setUsuarioSelected(u);
                        setOpenEditar(true);
                      }}>
                        Editar
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* ======================================
            MODAL DETALLE
        ====================================== */}
        <Modal open={openDetalle} onClose={() => setOpenDetalle(false)}>
          <Card sx={styleModal}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Detalle Usuario
              </Typography>

              {usuarioSelected && (
                <Grid container spacing={1}>
                  <Grid item xs={12}><b>Identificacion:</b> {usuarioSelected.identificacion}</Grid>                  
                  <Grid item xs={12}><b>Nombre:</b> {usuarioSelected.nombre} {usuarioSelected.apellido}</Grid>
                  <Grid item xs={12}><b>Email:</b> {usuarioSelected.email}</Grid>
                  <Grid item xs={12}><b>Departamento:</b> {usuarioSelected.departamento.nombre}</Grid>
                  <Grid item xs={12}><b>Municipio:</b> {usuarioSelected.municipio.nombre}</Grid>
                  <Grid item xs={12}><b>Dirección:</b> {usuarioSelected.direccion_detallada}</Grid>
                  <Grid item xs={12}><b>Rol:</b> {usuarioSelected.rol}</Grid>                  
                  <Grid item xs={12}><b>Teléfono:</b> {usuarioSelected.telefono ?? "—"}</Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Modal>

        {/* ======================================
            MODAL EDITAR
        ====================================== */}
        <Modal open={openEditar} onClose={() => setOpenEditar(false)}>
          <Card sx={styleModal}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                ¿Realmente deseas cambiar el rol?
              </Typography>

              {usuarioSelected && (
                <>
                  <Typography mb={2}>
                    <b>Usuario:</b> {usuarioSelected.nombre} <br />
                    <b>Identificación:</b> {usuarioSelected.identificacion} <br />
                    <b>Rol actual:</b> {usuarioSelected.rol}
                  </Typography>

                  {/* SELECT DE ROL */}
                  <TextField
                    select
                    label="Nuevo rol"
                    color="secondary"
                    fullWidth
                    sx={{ mb: 3 }}
                    value={usuarioSelected.rol}
                    onChange={(e) =>
                      setUsuarioSelected({
                        ...usuarioSelected,
                        rol: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="cliente">Cliente</MenuItem>
                    <MenuItem value="empleado">Empleado</MenuItem>
                    <MenuItem value="admin">Administrador</MenuItem>
                  </TextField>

                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleGuardarCambios}
                  >
                    Guardar cambios
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Modal>

      </Box>
    </DashboardLayout>
  );
}
