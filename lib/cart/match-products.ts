import "server-only";
import { rerankInstamartProductsWithGemini } from "@/lib/gemini/client";
import { searchInstamartItemWithMode } from "@/lib/swiggy/services";
import type { InstamartProduct } from "@/types/cart";

export type MatchConfidence = "low" | "medium" | "high";

type MatchRule = {
  query: string;
  requiredAny: string[];
  requiredAll?: string[];
  blocked?: string[];
};

const ingredientRules: Record<string, MatchRule> = {
  butter: {
    query: "butter",
    requiredAny: ["butter", "margarine"],
  },
  garlic: {
    query: "fresh garlic",
    requiredAny: ["garlic", "lahsun", "lasun"],
  },
  bread: {
    query: "bread slices",
    requiredAny: ["bread", "sandwich"],
    blocked: ["milk"],
  },
  cheese: {
    query: "cheese slice block spread",
    requiredAny: ["cheese"],
  },
  capsicum: {
    query: "green capsicum",
    requiredAny: ["capsicum", "bell pepper", "shimla"],
    blocked: ["chilli", "mirchi"],
  },
  "red pepper": {
    query: "red bell pepper",
    requiredAny: ["bell pepper", "capsicum"],
    requiredAll: ["red"],
    blocked: ["chilli", "mirchi", "powder"],
  },
  "red bell pepper": {
    query: "red bell pepper",
    requiredAny: ["bell pepper", "capsicum"],
    requiredAll: ["red"],
    blocked: ["chilli", "mirchi", "powder"],
  },
  onion: {
    query: "fresh onion",
    requiredAny: ["onion", "kanda"],
    blocked: ["powder", "seasoning"],
  },
  coriander: {
    query: "fresh coriander",
    requiredAny: ["coriander", "dhania"],
    blocked: ["curry leaves", "kadi patta"],
  },
  "fresh coriander": {
    query: "fresh coriander",
    requiredAny: ["coriander", "dhania"],
    blocked: ["curry leaves", "kadi patta"],
  },
  "green chilli": {
    query: "green chilli",
    requiredAny: ["green chilli", "chilli", "mirchi"],
    blocked: ["drumstick", "shevga"],
  },
  "red chilli powder": {
    query: "red chilli powder",
    requiredAny: ["chilli", "mirchi"],
    requiredAll: ["powder"],
    blocked: ["green chilli", "fresh chilli"],
  },
  carrot: {
    query: "fresh carrot",
    requiredAny: ["carrot", "gajar"],
    blocked: ["curry leaves", "kadi patta"],
  },
  carrots: {
    query: "fresh carrot",
    requiredAny: ["carrot", "gajar"],
    blocked: ["curry leaves", "kadi patta"],
  },
  salt: {
    query: "salt",
    requiredAny: ["salt", "namak"],
  },
};

export async function findProductsForIngredient(ingredientName: string) {
  const rule = getRuleForIngredient(ingredientName);
  const result = await searchInstamartItemWithMode(rule.query);
  const filteredProducts = applyHardFilters(result.products, rule);

  if (!filteredProducts.length) {
    return {
      products: [],
      mode: result.mode,
      confidence: "low" as MatchConfidence,
      reason: `No credible product matched ${ingredientName}.`,
    };
  }

  const ranking = await rerankInstamartProductsWithGemini({
    ingredientName,
    products: filteredProducts,
  });

  if (!ranking.productId || ranking.confidence === "low") {
    return {
      products: [],
      mode: result.mode,
      confidence: ranking.confidence,
      reason: ranking.reason,
    };
  }

  const selected = filteredProducts.find(
    (product) => product.id === ranking.productId,
  );

  return {
    products: selected ? [selected] : [],
    mode: result.mode,
    confidence: ranking.confidence,
    reason: ranking.reason,
  };
}

function getRuleForIngredient(ingredientName: string): MatchRule {
  const normalized = normalizeText(ingredientName);
  const exactRule = ingredientRules[normalized];
  if (exactRule) {
    return exactRule;
  }

  const matchedKey = Object.keys(ingredientRules).find((key) =>
    normalized.includes(key),
  );

  if (matchedKey) {
    return ingredientRules[matchedKey];
  }

  const words = normalized
    .split(" ")
    .filter((word) => word.length > 2 && !["fresh", "chopped"].includes(word));

  return {
    query: normalized,
    requiredAny: words.length ? words : [normalized],
  };
}

function applyHardFilters(products: InstamartProduct[], rule: MatchRule) {
  return products.filter((product) => {
    const name = normalizeText(product.name);
    const hasRequired = rule.requiredAny.some((term) =>
      name.includes(normalizeText(term)),
    );
    const hasAllRequired = (rule.requiredAll ?? []).every((term) =>
      name.includes(normalizeText(term)),
    );
    const hasBlocked = (rule.blocked ?? []).some((term) =>
      name.includes(normalizeText(term)),
    );

    return product.available && hasRequired && hasAllRequired && !hasBlocked;
  });
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
