// components/feedback/SweetAlert.jsx
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Integración con React
const MySwal = withReactContent(Swal);

/**
 * -------------------------------------------
 * ALERTA SIMPLE
 * -------------------------------------------
 * title: Título de la alerta
 * text: Mensaje a mostrar
 * icon: "success" | "error" | "warning" | "info"
 */
export const showAlert = (title, text, icon = "info") => {
  return MySwal.fire({
    title,
    text,
    icon,
    confirmButtonColor: "#FF3C00",
    background: "#ffffff", 
  });
};

/**
 * -------------------------------------------
 * ALERTA CON HTML
 * -------------------------------------------
 */
export const showHtmlAlert = (title, html, icon = "info") => {
  return MySwal.fire({
    title,
    html,
    icon,
    confirmButtonColor: "#FF3C00",
    background: "#ffffff",
  });
};

/**
 * -------------------------------------------
 * CONFIRMACIÓN
 * -------------------------------------------
 * Retorna true / false dependiendo de la respuesta
 */
export const showConfirm = async (
  title = "¿Estás seguro?",
  text = "No podrás revertir esto"
) => {
  const result = await MySwal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF3C00",
    cancelButtonColor: "#808080",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
    background: "#ffffff",
  });

  return result.isConfirmed;
};

/**
 * -------------------------------------------
 * TOAST (notificaciones rápidas)
 * -------------------------------------------
 */
export const showToast = (message, icon = "success") => {
  return MySwal.fire({
    toast: true,
    position: "bottom-right",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#ffffff",
  });
};
