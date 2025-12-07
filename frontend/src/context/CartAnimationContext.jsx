// src/contexts/CartAnimationContext.jsx
import React, { createContext, useRef } from "react";

export const CartAnimationContext = createContext({
  cartRef: { current: null },
});

export function CartAnimationProvider({ children }) {
  const cartRef = useRef(null);

  return (
    <CartAnimationContext.Provider value={{ cartRef }}>
      {children}
    </CartAnimationContext.Provider>
  );
}
