import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CategoriaForm from './CategoriaForm';

export default function CategoriaEditModal({ open, onClose, categoria, onUpdate }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [categoria]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await onUpdate(categoria.id, formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Categoría</DialogTitle>
      <DialogContent>
        <CategoriaForm initial={categoria || {}} onSubmit={handleSubmit} submitting={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
