// src/services/exportService.js
import api from "./api";

// Servicio genérico para exportar cualquier tabla a Excel
// Parámetros:
//  appName: string -> nombre de la app (ej. "usuarios", "productos")
//  modelName: string -> nombre del modelo (ej. "Usuario", "Producto")
export const exportTableExcel = async (appName, modelName) => {
  try {
    const res = await api.get("analisis/exportar/", {
      params: {
        app: appName,
        model: modelName,
      },
      responseType: "blob", // importante para archivos binarios
    });

    // Crear Blob y descargar archivo
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Nombre del archivo
    const fileName = `${modelName}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    // Crear enlace y hacer click para descargar
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error exportando Excel:", error);
    throw error;
  }
};
