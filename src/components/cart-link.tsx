"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import type { MarketCode } from "@/types";

export function CartLink({ market }: { market: MarketCode }) {
  const count = useCart((s) =>
    s.items.reduce((total, i) => total + i.quantity, 0),
  );

  return (
    <Link
      href={`/${market}/cart`}
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
    >
      Cart
      {count > 0 && (
        <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-indigo-900">
          {count}
        </span>
      )}
    </Link>
  );
}
