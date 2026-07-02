import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import { buildRecipeExtractionPrompt } from "@/lib/gemini/prompts";
import { fallbackExtractedRecipe } from "@/lib/gemini/schemas";
import type { ExtractedRecipe } from "@/types/recipe";
import type { InstamartProduct } from "@/types/cart";

export function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function extractRecipeWithGemini(
  recipeText: string,
): Promise<{ recipe: ExtractedRecipe; mode: "real" | "mock" }> {
  if (!hasGeminiKey()) {
    return { recipe: fallbackExtractedRecipe, mode: "mock" };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    contents: buildRecipeExtractionPrompt(recipeText),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          baseServings: { type: Type.NUMBER },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ["name", "quantity", "unit"],
            },
          },
        },
        required: ["title", "baseServings", "ingredients"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty extraction response.");
  }

  const parsed = JSON.parse(text) as ExtractedRecipe;
  if (!parsed.ingredients?.length) {
    throw new Error("No ingredients were extracted from the recipe.");
  }

  return { recipe: parsed, mode: "real" };
}

export async function rerankInstamartProductsWithGemini({
  ingredientName,
  products,
}: {
  ingredientName: string;
  products: InstamartProduct[];
}): Promise<{
  productId: string | null;
  confidence: "high" | "medium" | "low";
  reason: string;
}> {
  if (!hasGeminiKey() || !products.length) {
    return {
      productId: products[0]?.id ?? null,
      confidence: products[0] ? "low" : "low",
      reason: "Gemini unavailable; using filtered search order.",
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
    contents: [
      "You are validating grocery search results for an Instamart cart.",
      "Pick the product that semantically matches the ingredient.",
      "Reject substitutes unless they are clearly the same grocery item.",
      "Examples: garlic must not match curry leaves; bread must not match milk; coriander must not match curry leaves; carrot must not match curry leaves.",
      "Return no_match when none are credible.",
      "",
      `Ingredient: ${ingredientName}`,
      "Products:",
      JSON.stringify(
        products.slice(0, 12).map((product) => ({
          id: product.id,
          name: product.name,
          displaySize: product.displaySize,
          unit: product.unit,
          price: product.price,
        })),
      ),
    ].join("\n"),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productId: { type: Type.STRING, nullable: true },
          confidence: {
            type: Type.STRING,
            enum: ["high", "medium", "low"],
          },
          reason: { type: Type.STRING },
        },
        required: ["productId", "confidence", "reason"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    return {
      productId: null,
      confidence: "low",
      reason: "Gemini returned no ranking response.",
    };
  }

  const parsed = JSON.parse(text) as {
    productId?: string | null;
    confidence?: "high" | "medium" | "low";
    reason?: string;
  };

  return {
    productId: parsed.productId ?? null,
    confidence: parsed.confidence ?? "low",
    reason: parsed.reason ?? "No explanation returned.",
  };
}
