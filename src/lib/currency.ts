export type CurrencyOptions = {
  currency?: string; // ISO 4217, e.g. "USD"
  locale?: string; // e.g. "en-US"
  symbolPosition?: "prefix" | "suffix";
};

export const currencyCatalog = {
  USD: { label: "USD", locale: "en-US", symbolPosition: "prefix" as const, rateFromUSD: 1 },
  CAD: { label: "CAD", locale: "en-CA", symbolPosition: "prefix" as const, rateFromUSD: 1.36 },
  AUD: { label: "AUD", locale: "en-AU", symbolPosition: "prefix" as const, rateFromUSD: 1.53 },
  GBP: { label: "GBP", locale: "en-GB", symbolPosition: "prefix" as const, rateFromUSD: 0.78 },
  EUR: { label: "EUR", locale: "de-DE", symbolPosition: "prefix" as const, rateFromUSD: 0.92 },
  JPY: { label: "JPY", locale: "ja-JP", symbolPosition: "prefix" as const, rateFromUSD: 152 },
  BDT: { label: "BDT", locale: "en-BD", symbolPosition: "suffix" as const, rateFromUSD: 110 },
};

export type CurrencyCode = keyof typeof currencyCatalog;

export const supportedCurrencies: CurrencyCode[] = Object.keys(currencyCatalog) as CurrencyCode[];

function formatMinorUnits(minorUnits: number, { currency = "USD", locale = "en-US", symbolPosition = "prefix" }: CurrencyOptions = {}) {
  const amount = minorUnits / 100;
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

export function convertFromUSD(minorUSD: number, currency: CurrencyCode) {
  const rate = currencyCatalog[currency].rateFromUSD;
  return Math.round(minorUSD * rate);
}

// Formats integer USD minor units into the requested currency.
export function formatCurrency(minorUSD: number, currency: CurrencyCode = "USD") {
  const meta = currencyCatalog[currency];
  const converted = convertFromUSD(minorUSD, currency);
  return formatMinorUnits(converted, {
    currency,
    locale: meta.locale,
    symbolPosition: meta.symbolPosition,
  });
}
