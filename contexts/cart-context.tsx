"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GeneratedCart } from "@/types/cart";
import type { ExtractedRecipe } from "@/types/recipe";

export type DeliveryAddress = {
  id: string;
  addressLine: string;
  phoneNumber?: string;
  addressCategory?: string;
  addressTag?: string;
};

export type CartContextValue = {
  cart: GeneratedCart | null;
  recipe: ExtractedRecipe | null;
  servings: number;
  selectedAddress: DeliveryAddress | null;
  setCart: (cart: GeneratedCart | null) => void;
  setRecipe: (recipe: ExtractedRecipe | null) => void;
  setServings: (servings: number) => void;
  setSelectedAddress: (address: DeliveryAddress | null) => void;
  removeCartItem: (key: string) => void;
  resetCartSession: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<GeneratedCart | null>(null);
  const [recipe, setRecipe] = useState<ExtractedRecipe | null>(null);
  const [servings, setServings] = useState(1);
  const [selectedAddress, setSelectedAddress] =
    useState<DeliveryAddress | null>(null);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      recipe,
      servings,
      selectedAddress,
      setCart,
      setRecipe,
      setServings,
      setSelectedAddress,
      removeCartItem: (key: string) => {
        setCart((currentCart) => {
          if (!currentCart) {
            return currentCart;
          }

          const items = currentCart.items.filter(
            (item) => getCartItemKey(item) !== key,
          );
          const itemTotal = items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0,
          );
          const deliveryFee = itemTotal >= 199 ? 0 : 25;
          const handlingFee = items.length ? 10 : 0;

          return {
            ...currentCart,
            items,
            itemTotal,
            deliveryFee,
            handlingFee,
            total: itemTotal + deliveryFee + handlingFee,
          };
        });
      },
      resetCartSession: () => {
        setCart(null);
        setRecipe(null);
        setServings(1);
        setSelectedAddress(null);
      },
    }),
    [cart, recipe, selectedAddress, servings],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function getCartItemKey(item: GeneratedCart["items"][number]) {
  return `${item.ingredient.name}-${item.product.id}`;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
