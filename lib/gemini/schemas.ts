import type { ExtractedRecipe } from "@/types/recipe";

export const fallbackExtractedRecipe: ExtractedRecipe = {
  title: "Parsed Recipe",
  baseServings: 2,
  ingredients: [
    { name: "milk", quantity: 1, unit: "l" },
    { name: "bread", quantity: 1, unit: "pack" },
    { name: "eggs", quantity: 6, unit: "piece" },
    { name: "butter", quantity: 100, unit: "g" },
  ],
};
