import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

export default function ButtonWithHand({ children }) {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const [handPos, setHandPos] = useState({ top: 0, left: 0 });

  const updateHandPosition = () => {
    if (containerRef.current && buttonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();

      // Posición relativa al contenedor
      const top = buttonRect.top - containerRect.top + buttonRect.height / 2;
      const left = buttonRect.left - containerRect.left + buttonRect.width * 0.7;

      setHandPos({ top, left });
    }
  };

  useEffect(() => {
    updateHandPosition();
    window.addEventListener("resize", updateHandPosition);
    window.addEventListener("scroll", updateHandPosition);
    return () => {
      window.removeEventListener("resize", updateHandPosition);
      window.removeEventListener("scroll", updateHandPosition);
    };
  }, []);

  return (
    <Box ref={containerRef} sx={{ position: "relative", display: "inline-block", overflow: "visible" }}>
      {/* Botón */}
      <Box ref={buttonRef} >{children}</Box>

      {/* Mano animada */}
      <Box
        sx={{
          position: "absolute",
          top: handPos.top,
          left: handPos.left,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "handMove 1s infinite alternate",
          "@keyframes handMove": {
            "0%": { transform: "translate(-50%, -50%) translateY(0)" },
            "100%": { transform: "translate(-50%, -50%) translateY(-10px)" },
          },
        }}
      >
        <img
          src="/handPointer.png"
          alt="Hand Pointer"
          style={{ width: 100, height: 100 }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 30,
            height: 30,
            border: "3px solid rgba(43,110,57,0.7)",
            borderRadius: "50%",
            bottom: 60,
            left: "30%",
            transform: "translateX(-50%)",
            animation: "wave 1.5s infinite",
            "@keyframes wave": {
              "0%": { transform: "translateX(-50%) scale(0.5)", opacity: 0.6 },
              "50%": { transform: "translateX(-50%) scale(1.5)", opacity: 0.3 },
              "100%": { transform: "translateX(-50%) scale(2)", opacity: 0 },
            },
          }}
        />
      </Box>
    </Box>
  );
}
