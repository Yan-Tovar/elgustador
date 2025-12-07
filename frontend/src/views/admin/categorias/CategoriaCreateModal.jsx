// src/views/admin/categorias/CategoriaCreateModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme } from "@mui/material";
import CategoriaForm from "./CategoriaForm";

export default function CategoriaCreateModal({ open, onClose, onCreate }) {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await onCreate(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // resetKey cambia cuando abrimos el modal, forzando reinicio seguro
  const resetKey = open ? Date.now() : null;

  return (
    <Dialog open={open} onClose={!loading ? onClose : null} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, bgcolor: theme.palette.background.paper } }}>
      <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>Crear Categoría</DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* initial=null (creación). resetKey para reiniciar el form cada vez que se abre */}
        <CategoriaForm initial={null} onSubmit={handleSubmit} submitting={loading} resetKey={resetKey} />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: theme.palette.info.main, fontWeight: "bold" }}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
