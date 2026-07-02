export type IngredientUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "cup"
  | "tbsp"
  | "tsp"
  | "piece"
  | "pack"
  | "pinch"
  | "to taste";

export type ExtractedIngredient = {
  name: string;
  quantity: number;
  unit: IngredientUnit | string;
  notes?: string;
};
