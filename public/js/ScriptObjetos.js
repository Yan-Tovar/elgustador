function updateCount(change) {
    const input = document.getElementById('productCount');
    let currentValue = parseInt(input.value) || 0;
    currentValue += change;
    if (currentValue < 0) currentValue = 0;
    input.value = currentValue;
  }
// Notificaciones
function NotificacionAyuda() {
  const contenedor = document.getElementById('notificaciones-container');

  // Crear notificación
  const noti = document.createElement('div');
  noti.className = '-c-v6';
  noti.innerHTML = `
    <div class="-e-v4">
      <div><i class="material-icons">info</i>Ayuda</div>
      <p>¡Hola! Queremos ayudarte y atenderte, llama gratis al 108000325!</p>
    </div>
  `;

  contenedor.appendChild(noti);

  // Reproducir sonido
  const sonido = document.getElementById('notificacion-sonido');
  sonido.play();

  // Eliminar la notificación después de 5 segundos
  setTimeout(() => {
    noti.style.opacity = '0';
    noti.style.transition = 'opacity 0.5s ease';
    setTimeout(() => noti.remove(), 500);
  }, 5000);
}
// Modal subir foto
function abrirModal() {
  document.getElementById("miModal").style.display = "block";
}

function cerrarModal() {
  document.getElementById("miModal").style.display = "none";
}
function mostrarPreview(event) {
  const input = event.target;
  const preview = document.getElementById("preview");
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    }
    reader.readAsDataURL(input.files[0]);
  }
}

// Cierra el modal si haces clic fuera del contenido
window.onclick = function(event) {
  const modal = document.getElementById("miModal");
  if (event.target == modal) {
    cerrarModal();
  }
}
function sonido(){
  // Reproducir sonido
  const sonido = document.getElementById('notificacion-sonido');
  sonido.play();
}
// Funcion paleta de colores para fondo
function fondoColor(tituloColor){
  const h4 = document.getElementById("tituloColor");
  const colorPicker = document.getElementById("colorPicker");

  h4.addEventListener("click", () => {
    colorPicker.click();
  });

  colorPicker.addEventListener("input", (event) => {
    h4.style.color = event.target.value;
  });
}
// Funcion para paleta de colores para texto
function textoColor(tituloColor){
  const h4 = document.getElementById("tituloColor");
  const pickerH4 = document.getElementById("colorPickerH4");

  h4.addEventListener("click", () => {
    pickerH4.click();
  });

  pickerH4.addEventListener("input", (event) => {
    h4.style.color = event.target.value;
  });

  const h1 = document.getElementById("tituloPrincipal");
  const pickerH1 = document.getElementById("colorPickerH1");

  h1.addEventListener("click", () => {
    pickerH1.click();
  });

  pickerH1.addEventListener("input", (event) => {
    h1.style.color = event.target.value;
  });
}