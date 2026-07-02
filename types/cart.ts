export type CartStatus = "draft" | "confirmed" | "failed";

import type { ExtractedIngredient } from "@/types/ingredient";

export type InstamartProduct = {
  id: string;
  name: string;
  packSize: number;
  unit: string;
  displaySize: string;
  price: number;
  image?: string;
  available: boolean;
};

export type CartLineItem = {
  ingredient: ExtractedIngredient;
  requiredQuantity: number;
  requiredUnit: string;
  product: InstamartProduct;
  quantity: number;
  coveredQuantity: number;
  leftoverQuantity: number;
  matchStatus?: "matched" | "needs_review";
  matchConfidence?: "high" | "medium" | "low";
  matchReason?: string;
};

export type GeneratedCart = {
  items: CartLineItem[];
  itemTotal: number;
  deliveryFee: number;
  handlingFee: number;
  total: number;
  mode: "real" | "mock";
};
