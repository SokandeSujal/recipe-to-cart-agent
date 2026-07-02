export type PackSelectionReason = "exact" | "covers_required_quantity" | "fallback";

import type { InstamartProduct } from "@/types/cart";

export function selectBestPack(
  products: InstamartProduct[],
  requiredQuantity: number,
  requiredUnit: string,
): { product: InstamartProduct; quantity: number; coveredQuantity: number } {
  const availableProducts = products.filter((product) => product.available);
  const available = availableProducts.flatMap((product) => {
    const compatiblePackSize = getCompatiblePackSize(product, requiredUnit);

    if (!compatiblePackSize) {
      return [];
    }

    return [{ product, compatiblePackSize }];
  });

  if (!availableProducts.length) {
    throw new Error("No available Instamart products returned for ingredient.");
  }

  if (!available.length) {
    const fallbackProduct = [...availableProducts].sort(
      (a, b) => a.price - b.price,
    )[0];

    return {
      product: fallbackProduct,
      quantity: 1,
      coveredQuantity: requiredQuantity,
    };
  }

  const candidates = available
    .map(({ product, compatiblePackSize }) => {
      const quantity = Math.max(1, Math.ceil(requiredQuantity / compatiblePackSize));
      return {
        product,
        quantity,
        coveredQuantity: quantity * compatiblePackSize,
        leftoverQuantity: quantity * compatiblePackSize - requiredQuantity,
      };
    })
    .sort((a, b) => {
      if (a.leftoverQuantity !== b.leftoverQuantity) {
        return a.leftoverQuantity - b.leftoverQuantity;
      }

      return a.product.price * a.quantity - b.product.price * b.quantity;
    });

  return candidates[0];
}

function getCompatiblePackSize(product: InstamartProduct, requiredUnit: string) {
  if (product.unit === requiredUnit) {
    return product.packSize;
  }

  if (
    (requiredUnit === "g" && product.unit === "ml") ||
    (requiredUnit === "ml" && product.unit === "g")
  ) {
    return product.packSize;
  }

  if (
    (requiredUnit === "g" || requiredUnit === "ml") &&
    product.unit === "l"
  ) {
    return product.packSize * 1000;
  }

  return null;
}
