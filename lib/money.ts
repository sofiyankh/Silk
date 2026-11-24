export const MILLIMES_PER_TND = 1000;

export function formatTND(millimes: number, locale: "fr" | "en" = "en"): string {
  const tndValue = millimes / MILLIMES_PER_TND;
  return new Intl.NumberFormat(locale === "fr" ? "fr-TN" : "en-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(tndValue);
}

// Compact format for cards or moodboard aesthetic (e.g. "$89.00" or "89.000 DT")
export function formatPrice(millimes: number, locale: "fr" | "en" = "en"): string {
  const tndValue = millimes / MILLIMES_PER_TND;
  return `${tndValue.toFixed(3)} TND`;
}
