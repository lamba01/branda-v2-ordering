import type { CartItem } from "@/types";

export interface Totals {
  subtotalUsd: number;
  taxUsd: number;
  totalUsd: number;
}

//  All amounts stay in base USD. formatPrice converts for display.
export function computeTotals(items: CartItem[], taxRate: number): Totals {
  const subtotalUsd = items.reduce(
    (sum, i) => sum + i.unitPriceUsd * i.quantity,
    0,
  );
  const taxUsd = subtotalUsd * taxRate;
  return { subtotalUsd, taxUsd, totalUsd: subtotalUsd + taxUsd };
}
