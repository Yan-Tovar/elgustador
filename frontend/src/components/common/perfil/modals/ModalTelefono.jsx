// components/perfil/modals/ModalTelefono.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { updateUsuario } from "../../../../services/usuariosService";
import TelefonoInput from "../../TelefonoInput";

export default function ModalTelefono({ open, onClose, usuario, setUsuario }) {
  const [telefono, setTelefono] = useState(usuario.telefono || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateUsuario({ telefono });
      setUsuario(res.data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Editar teléfono</DialogTitle>

      <DialogContent dividers>
        <TelefonoInput
          fullWidth
          label="Teléfono"
          value={telefono}
          sx={{ mt: 2 }}
          onChange={(e) => setTelefono(e.target.value)}
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
