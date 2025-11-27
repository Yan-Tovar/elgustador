import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { showConfirm } from "../../components/feedback/SweetAlert";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Cerrar sesión",
      "¿Seguro que deseas cerrar tu sesión?"
    );

    if (confirmed) {
      logout(); 
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
    >
      Cerrar sesión
    </Button>
  );
}
