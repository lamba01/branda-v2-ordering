import Link from "next/link";
import type { Market } from "@/types";
import { CartLink } from "./cart-link";
import { MarketSwitcher } from "./market-switcher";

export function Header({ market }: { market: Market }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href={`/${market.code}`}
          className="text-xl font-bold text-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600"
        >
          Branda
        </Link>

        <nav aria-label="Main">
          <Link
            href={`/${market.code}/services`}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            Services
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <MarketSwitcher current={market.code} />
          <CartLink market={market.code} />
        </div>
      </div>
    </header>
  );
}
