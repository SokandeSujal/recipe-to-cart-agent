export const RECIPE_EXTRACTION_PROMPT_NAME = "recipe-ingredient-extraction";

export function buildRecipeExtractionPrompt(recipeText: string) {
  return `
Extract grocery ingredients from the recipe text.

Return only strict JSON that matches this TypeScript shape:
{
  "title": "short recipe title",
  "baseServings": number,
  "ingredients": [
    { "name": "ingredient name", "quantity": number, "unit": "unit", "notes": "optional short note" }
  ]
}

Rules:
- No markdown, no prose, no comments.
- Use numeric quantities only.
- Infer baseServings if present, otherwise use 2.
- Normalize ingredient names for grocery search.
- Exclude cookware, serving dishes, and method-only words.

Recipe:
${recipeText}
`;
}
