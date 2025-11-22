// components/auth/LogoutButton.jsx
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutBackend } from "../../utils/Auth";
import { showConfirm } from "../feedback/SweetAlert";

export default function LogoutButton() {
  const handleLogout = async () => {
    const confirm = await showConfirm(
      "Cerrar sesión",
      "¿Seguro que deseas cerrar tu sesión?"
    );

    if (confirm) {
      logoutBackend();
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
    >
      Cerrar Sesión
    </Button>
  );
}
