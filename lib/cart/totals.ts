export function formatPaiseAsRupees(paise: number) {
  return `Rs ${Math.round(paise / 100)}`;
}
