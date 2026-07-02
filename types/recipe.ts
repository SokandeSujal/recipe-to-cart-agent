export type RecipeSource = "text" | "youtube" | "instagram" | "upload";

import type { ExtractedIngredient } from "@/types/ingredient";

export type ExtractedRecipe = {
  title: string;
  baseServings: number;
  ingredients: ExtractedIngredient[];
};
