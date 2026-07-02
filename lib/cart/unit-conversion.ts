export function normalizeQuantity(quantity: number, unit: string) {
  const normalizedUnit = unit.toLowerCase().trim();

  if (normalizedUnit === "kg" || normalizedUnit === "kilogram" || normalizedUnit === "kilograms") {
    return { quantity: quantity * 1000, unit: "g" };
  }

  if (
    normalizedUnit === "l" ||
    normalizedUnit === "liter" ||
    normalizedUnit === "litre" ||
    normalizedUnit === "liters" ||
    normalizedUnit === "litres"
  ) {
    return { quantity, unit: "l" };
  }

  if (normalizedUnit === "cup" || normalizedUnit === "cups") {
    return { quantity: quantity * 120, unit: "g" };
  }

  if (
    normalizedUnit === "tbsp" ||
    normalizedUnit === "tablespoon" ||
    normalizedUnit === "tablespoons"
  ) {
    return { quantity: quantity * 15, unit: "g" };
  }

  if (
    normalizedUnit === "tsp" ||
    normalizedUnit === "teaspoon" ||
    normalizedUnit === "teaspoons"
  ) {
    return { quantity: quantity * 5, unit: "g" };
  }

  if (normalizedUnit === "pinch" || normalizedUnit === "pinches") {
    return { quantity: Math.max(1, quantity), unit: "g" };
  }

  if (normalizedUnit === "ml") {
    return { quantity, unit: "ml" };
  }

  if (
    normalizedUnit === "piece" ||
    normalizedUnit === "pieces" ||
    normalizedUnit === "count" ||
    normalizedUnit === "clove" ||
    normalizedUnit === "cloves" ||
    normalizedUnit === "large" ||
    normalizedUnit === "medium" ||
    normalizedUnit === "small"
  ) {
    return { quantity, unit: "piece" };
  }

  return { quantity, unit: normalizedUnit || "pack" };
}
