// components/perfil/modals/ModalDireccion.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { updateUsuario } from "../../../../services/usuariosService";
import { getDepartamentos, getMunicipios } from "../../../../services/auth";

export default function ModalDireccion({ open, onClose, usuario, setUsuario }) {
  const [form, setForm] = useState({
    departamento: usuario.departamento?.id || "",
    municipio: usuario.municipio?.id || "",
    direccion_detallada: usuario.direccion_detallada || "",
  });

  const [dptos, setDptos] = useState([]);
  const [mun, setMun] = useState([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const resD = await getDepartamentos();
      setDptos(resD.data);

      const resM = await getMunicipios();
      setMun(resM.data.filter((m) => m.departamento.id === form.departamento));
    };
    load();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "departamento") {
      setForm({ ...form, departamento: value, municipio: "" });

      const resM = await getMunicipios();
      setMun(resM.data.filter((m) => m.departamento.id == value));
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateUsuario(form);
      setUsuario(res.data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Editar dirección</DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          select
          sx={{ mt: 2 }}
          label="Departamento"
          name="departamento"
          value={form.departamento}
          onChange={handleChange}
        >
          {dptos.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          sx={{ mt: 2 }}
          label="Municipio"
          name="municipio"
          disabled={!mun.length}
          value={form.municipio}
          onChange={handleChange}
        >
          {mun.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Dirección"
          name="direccion_detallada"
          value={form.direccion_detallada}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
