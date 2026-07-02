import "server-only";
import { findProductsForIngredient } from "@/lib/cart/match-products";
import { selectBestPack } from "@/lib/cart/pack-size";
import { scaleQuantity } from "@/lib/cart/scale-ingredients";
import { calculateCartTotals } from "@/lib/cart/totals";
import { normalizeQuantity } from "@/lib/cart/unit-conversion";
import type { CartLineItem, GeneratedCart } from "@/types/cart";
import type { ExtractedRecipe } from "@/types/recipe";

export async function buildCartFromRecipe(
  recipe: ExtractedRecipe,
  selectedServings: number,
): Promise<GeneratedCart> {
  const items: CartLineItem[] = [];
  let usedRealInstamart = true;

  for (const ingredient of recipe.ingredients) {
    const scaled = scaleQuantity(
      ingredient.quantity,
      recipe.baseServings,
      selectedServings,
    );
    const normalized = normalizeQuantity(scaled, ingredient.unit);
    const result = await findProductsForIngredient(ingredient.name);
    if (result.mode !== "real") {
      usedRealInstamart = false;
    }

    if (!result.products.length) {
      items.push({
        ingredient,
        requiredQuantity: normalized.quantity,
        requiredUnit: normalized.unit,
        product: {
          id: `needs-review-${ingredient.name}`,
          name: `Needs review: ${ingredient.name}`,
          packSize: normalized.quantity,
          unit: normalized.unit,
          displaySize: "No confident match",
          price: 0,
          available: false,
        },
        quantity: 0,
        coveredQuantity: 0,
        leftoverQuantity: 0,
        matchStatus: "needs_review",
        matchConfidence: result.confidence,
        matchReason: result.reason,
      });
      continue;
    }

    const selected = selectBestPack(
      result.products,
      normalized.quantity,
      normalized.unit,
    );

    items.push({
      ingredient,
      requiredQuantity: normalized.quantity,
      requiredUnit: normalized.unit,
      product: selected.product,
      quantity: selected.quantity,
      coveredQuantity: selected.coveredQuantity,
      leftoverQuantity: selected.coveredQuantity - normalized.quantity,
      matchStatus: "matched",
      matchConfidence: result.confidence,
      matchReason: result.reason,
    });
  }

  const totals = calculateCartTotals(items);

  return {
    items,
    ...totals,
    mode: usedRealInstamart ? "real" : "mock",
  };
}
