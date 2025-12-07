// src/components/common/ProductosCard.jsx
import { useState, useRef, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Chip, // Agregado para el mensaje de stock bajo
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoIcon from "@mui/icons-material/Info";
import { CartAnimationContext } from "../../context/CartAnimationContext";

/**
 * ProductosCard con:
 * - animación "fly to cart" hacia cartRef
 * - burbujas verdes (agregar) y naranjas (reducir) que suben desde el botón
 *
 * Props:
 * - producto
 * - cantidad
 * - onCantidadChange(productoId, nuevaCantidad, stock)
 * - onAdd(producto)  --> se llamará después de la animación
 * - onDetalle(producto)
 */

export default function ProductosCard({
  producto,
  cantidad,
  onCantidadChange,
  onAdd,
  onDetalle,
}) {
  const { cartRef } = useContext(CartAnimationContext);
  const imagen = producto.imagen1 || "https://via.placeholder.com/400";

  const imgRef = useRef(null); // referencia a la imagen dentro del card
  const addBtnRef = useRef(null);
  const minusBtnRef = useRef(null);

  // Contador local para forzar re-render de pequeñas animaciones si hace falta
  const [animTrigger, setAnimTrigger] = useState(0);

  // VALIDACIÓN DE ESTADO
  const isLogged = !!onAdd; // Si onAdd está presente, el usuario está logueado (o se le permite agregar)
  const isOutOfStock = producto.stock === 0;
  const isLowStock = producto.stock > 0 && producto.stock < 5;

  // ---- BURBUJA ----
  const spawnBubble = (originEl, color = "green") => {
    if (!originEl) return;
    const rect = originEl.getBoundingClientRect();

    const bubble = document.createElement("div");
    bubble.style.position = "fixed";
    bubble.style.left = `${rect.left + rect.width / 2}px`;
    bubble.style.top = `${rect.top + rect.height / 2}px`;
    bubble.style.width = "14px";
    bubble.style.height = "14px";
    bubble.style.borderRadius = "50%";
    bubble.style.background = color;
    bubble.style.zIndex = 9999;
    bubble.style.opacity = "1";
    bubble.style.transform = "translateY(0)";
    bubble.style.transition =
      "transform 600ms cubic-bezier(.2,.8,.2,1), opacity 600ms linear";

    document.body.appendChild(bubble);

    // trigger animation: subir y desaparecer
    requestAnimationFrame(() => {
      bubble.style.transform = "translateY(-60px) scale(1.2)";
      bubble.style.opacity = "0";
    });

    // cleanup
    setTimeout(() => {
      bubble.remove();
      setAnimTrigger((t) => t + 1);
    }, 650);
  };

  // ---- FLY TO CART (clonar imagen y animar a cartRef) ----
  const flyToCart = async () => {
    const target = cartRef?.current;
    const imgEl = imgRef.current;
    if (!imgEl || !target) {
      // si no hay target, simplemente llamar onAdd directamente
      try {
        await onAdd(producto);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // crear clon
    const rectImg = imgEl.getBoundingClientRect();
    const rectCart = target.getBoundingClientRect();

    const clone = imgEl.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${rectImg.left}px`;
    clone.style.top = `${rectImg.top}px`;
    clone.style.width = `${rectImg.width}px`;
    clone.style.height = `${rectImg.height}px`;
    clone.style.objectFit = "contain";
    clone.style.zIndex = 9999;
    clone.style.transition =
      "transform 700ms cubic-bezier(.2,.8,.2,1), left 700ms linear, top 700ms linear, opacity 400ms linear";
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);

    // calculate translate
    const deltaX = rectCart.left + rectCart.width / 2 - (rectImg.left + rectImg.width / 2);
    const deltaY = rectCart.top + rectCart.height / 2 - (rectImg.top + rectImg.height / 2);

    // scale down while moving
    requestAnimationFrame(() => {
      clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.18)`;
      clone.style.opacity = "0.9";
    });

    // small pop on cart target to indicate arrival
    setTimeout(() => {
      // briefly scale the cart icon
      target.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }],
        { duration: 300 }
      );
    }, 650);

    // wait for animation then cleanup and call onAdd
    setTimeout(async () => {
      clone.remove();
      try {
        await onAdd(producto);
      } catch (e) {
        console.error(e);
      }
    }, 750);
  };

  // ---- handlers para botones + / - ----
  const handleAddClick = () => {
    // bubble verde en el boton +
    spawnBubble(addBtnRef.current, "#4caf50"); // verde
    // aumentar cantidad localmente vía callback
    onCantidadChange(producto.id, (cantidad || 1) + 1, producto.stock);
  };

  const handleRemoveClick = () => {
    // bubble naranja en el boton -
    spawnBubble(minusBtnRef.current, "#ff9800"); // naranja
    const newCantidad = Math.max(1, (cantidad || 1) - 1);
    onCantidadChange(producto.id, newCantidad, producto.stock);
  };

  const handleAddToCart = () => {
    // bubble verde en el boton agregar
    spawnBubble(addBtnRef.current, "#4caf50");
    // fly animation (clona la imagen y llama onAdd al final)
    flyToCart();
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 240,
        minWidth: 240,
        height: 360,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      {/* Imagen */}
      <Box
        sx={{
          height: 150,
          width: "100%",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          position: 'relative', // Necesario para posicionar el Chip
        }}
      >
        <Box
          component="img"
          src={imagen}
          alt={producto.nombre}
          ref={imgRef}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        
        {/* 2. Mensaje de Stock Bajo (si es menor a 5) */}
        {isLowStock && (
            <Chip
                label="Stock Bajo"
                color="warning"
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
            />
        )}

      </Box>

      {/* Contenido */}
      <CardContent sx={{ padding: 2, flexGrow: 1 }}>
        {/* Nombre con tooltip */}
        <Tooltip title={producto.nombre} arrow>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {producto.nombre}
          </Typography>
        </Tooltip>

        {/* Precio */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="h6" color="secondary" fontWeight="bold">
            ${producto.precio}
          </Typography>

          {producto.precio_anterior && (
            <Typography
              variant="body2"
              sx={{ color: "gray", textDecoration: "line-through" }}
            >
              ${producto.precio_anterior}
            </Typography>
          )}
        </Stack>
        
        {/* 3. Mensaje Producto No Disponible (si stock es cero) */}
        {isOutOfStock && (
            <Typography variant="body1" color="error" fontWeight="bold" sx={{ mt: 1 }}>
                Producto no disponible
            </Typography>
        )}

        {/* 1. Botón de detalle (Se muestra solo si el usuario está logueado o si onDetalle existe y es el catálogo público) */}
        {/* Aquí usaremos la lógica: si la vista es pública (onAdd es null) O si la vista es privada, siempre mostramos el detalle. */}
        {isLogged && (
          <Button
            size="small"
            variant="outlined"
            // Nota: color="black" no es un color de tema estándar de MUI. Usaré 'default' o 'primary'. Usaré 'default' para mantener la intención.
            color="default" 
            startIcon={<InfoIcon />}
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => onDetalle(producto)}
          >
            Ver detalle
          </Button>
        )}
        
        {/* Separación visual para botones de carrito */}
        {isLogged && <Box sx={{ mt: 2 }}/>} 

        {/* Control de cantidad y Agregar al Carrito (Solo si el usuario está logueado) */}
        {isLogged && (
          <>
            {/* Control de cantidad */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 2 }}
            >
              <IconButton
                onClick={handleRemoveClick}
                disabled={cantidad <= 1 || isOutOfStock} // Deshabilitar si está agotado
                ref={minusBtnRef}
              >
                <RemoveIcon />
              </IconButton>

              <Typography variant="h6">{cantidad}</Typography>

              <IconButton
                onClick={handleAddClick}
                disabled={cantidad >= producto.stock || isOutOfStock} // Deshabilitar si está agotado
                ref={addBtnRef}
              >
                <AddIcon />
              </IconButton>
            </Stack>

            {/* Botón agregar al carrito */}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={isOutOfStock} // Deshabilitar si está agotado
            >
              Agregar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}