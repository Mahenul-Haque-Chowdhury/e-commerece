export type CurrencyOptions = {
  currency?: string; // ISO 4217, e.g. "BDT"
  locale?: string; // e.g. "en-BD" or "bn-BD"
  symbolPosition?: "prefix" | "suffix"; // keep current UX: suffix by default
};

// Formats integer minor units as currency, defaulting to BDT with a suffix symbol (e.g., 199900 -> "1,999.00৳").
export function formatCurrency(
  minorUnits: number,
  { currency = "BDT", locale = "en-BD", symbolPosition = "suffix" }: CurrencyOptions = {}
) {
  const amount = minorUnits / 100;
  // Use Intl to format number parts and symbol; we will re-arrange if suffix requested
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(amount);

  const symbol = parts.find((p) => p.type === "currency")?.value ?? "";
  const number = parts
    .filter((p) => p.type !== "currency")
    .map((p) => p.value)
    .join("");

  if (symbolPosition === "prefix") return `${symbol}${number}`;
  return `${number}${symbol}`;
}
