export function formatPaiseAsRupees(paise: number) {
  return `Rs ${Math.round(paise / 100)}`;
}

import type { CartLineItem } from "@/types/cart";

export function calculateCartTotals(items: CartLineItem[]) {
  const itemTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const deliveryFee = itemTotal >= 199 ? 0 : 25;
  const handlingFee = items.length ? 10 : 0;

  return {
    itemTotal,
    deliveryFee,
    handlingFee,
    total: itemTotal + deliveryFee + handlingFee,
  };
}
