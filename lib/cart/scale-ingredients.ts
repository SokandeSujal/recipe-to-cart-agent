export function getScaleFactor(baseServings: number, selectedServings: number) {
  if (baseServings <= 0) {
    return 1;
  }

  return selectedServings / baseServings;
}

export function scaleQuantity(
  quantity: number,
  baseServings: number,
  selectedServings: number,
) {
  return quantity * getScaleFactor(baseServings, selectedServings);
}
