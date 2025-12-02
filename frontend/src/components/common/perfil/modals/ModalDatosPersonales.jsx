// components/perfil/modals/ModalDatosPersonales.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { updateUsuario } from "../../../../services/usuariosService";

// Importa tu input personalizado (valida solo letras)
import TextoSoloLetrasInput from "../../TextoSoloLetrasInput";

export default function ModalDatosPersonales({
  open,
  onClose,
  usuario,
  setUsuario,
}) {
  const [form, setForm] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
  });
  
  const [validNombre, setValidNombre] = useState(true);
  const [validApellido, setValidApellido] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      <DialogTitle>Editar datos personales</DialogTitle>

      <DialogContent dividers>
        <TextoSoloLetrasInput
          label="Nombre"
          name="nombre"
          value={form.nombre}
          sx={{ mt: 2 }}
          onChange={handleChange}
          onValidChange={setValidNombre}
        />

        <TextoSoloLetrasInput
        label="Apellido"
          name="apellido"
          value={form.apellido}
          sx={{ mt: 2 }}
          onChange={handleChange}
          onValidChange={setValidApellido}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button variant="contained" onClick={handleSave} disabled={saving || !validNombre || !validApellido} >
          {saving ? <CircularProgress size={20} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
