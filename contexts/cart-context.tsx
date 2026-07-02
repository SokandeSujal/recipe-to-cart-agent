"use client";

import { createContext } from "react";

export type CartContextValue = {
  itemCount: number;
};

export const CartContext = createContext<CartContextValue>({
  itemCount: 0,
});
