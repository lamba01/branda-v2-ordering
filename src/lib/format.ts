import type { Market } from "@/types";

export function formatPrice(amountUsd: number, market: Market): string {
  const converted = amountUsd * market.rate;
  const rounded = market.currency === "NGN" ? Math.round(converted) : converted;

  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    maximumFractionDigits: market.currency === "NGN" ? 0 : 2,
  }).format(rounded);
}
