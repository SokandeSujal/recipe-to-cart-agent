export function getScaleFactor(baseServings: number, selectedServings: number) {
  if (baseServings <= 0) {
    return 1;
  }

  return selectedServings / baseServings;
}
