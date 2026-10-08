"use client";

import { usePathname, useRouter } from "next/navigation";
import { isMarketCode, marketCodes, markets } from "@/lib/market";
import type { MarketCode } from "@/types";

export function MarketSwitcher({ current }: { current: MarketCode }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    if (!isMarketCode(next)) return;

    // keep the same page and filters, only swap the market segment
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}${window.location.search}`);
  }

  return (
    <div>
      <label htmlFor="market-select" className="sr-only">
        Country and currency
      </label>
      <select
        id="market-select"
        value={current}
        onChange={handleChange}
        className="rounded-md border border-slate-300 cursor-pointer bg-white px-2 py-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-600"
      >
        {marketCodes.map((code) => (
          <option key={code} value={code}>
            {markets[code].name} ({markets[code].currency})
          </option>
        ))}
      </select>
    </div>
  );
}
