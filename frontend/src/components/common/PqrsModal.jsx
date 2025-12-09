// components/common/PqrsModal.jsx
import { useState } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PqrsForm from "./PqrsForm";

export default function PqrsModal({ open, onClose, onSuccess }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-pqrs-title"
      aria-describedby="modal-pqrs-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 500 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography id="modal-pqrs-title" variant="h6">
            Enviar PQRS
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <PqrsForm onSuccess={onSuccess} />
      </Box>
    </Modal>
  );
}
