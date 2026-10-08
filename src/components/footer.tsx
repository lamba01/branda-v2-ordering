import Link from "next/link";
import { marketCodes, markets } from "@/lib/market";
import type { MarketCode } from "@/types";

export function Footer({ current }: { current: MarketCode }) {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:justify-between">
        <div>
          <p className="text-lg font-bold text-indigo-700">Branda</p>
          <p className="mt-1 max-w-xs text-sm text-slate-600">
            Branding services for businesses in Nigeria, the USA, the UK and
            Canada.
          </p>
        </div>

        <nav aria-label="Markets">
          <h2 className="text-sm font-semibold text-slate-900">Our markets</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {marketCodes.map((code) => (
              <li key={code}>
                <Link
                  href={`/${code}`}
                  aria-current={code === current ? "true" : undefined}
                  className="text-slate-700 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-700 aria-current:font-semibold"
                >
                  {markets[code].name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-slate-200 py-4 text-center text-xs text-slate-600">
        Demo build with mock data and illustrative prices.
      </p>
    </footer>
  );
}
