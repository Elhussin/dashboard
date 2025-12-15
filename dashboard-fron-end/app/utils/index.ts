// Helpers
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "SAR", // Changed to SAR if Saudi Riyal, defaulting USD for now or convert to user locale
    maximumFractionDigits: 0,
  }).format(value);
}
