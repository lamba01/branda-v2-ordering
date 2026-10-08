import Link from "next/link";
import { marketCodes, markets } from "@/lib/market";
import type { MarketCode } from "@/types";

export function Footer({ current }: { current: MarketCode }) {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-indigo-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-10 py-8 sm:flex-row sm:justify-between">
        <div>
          <p className="text-2xl font-bold text-white">Branda</p>
          <p className="mt-1 max-w-xs text-sm text-white">
            Branding services for businesses in Nigeria, the USA, the UK and
            Canada.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-5">
            Help
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/about"
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                How it Works
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                Contact & Returns
              </Link>
            </li>
          </ul>
        </div>

        <nav aria-label="Markets">
          <h2 className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-5">
            Our markets
          </h2>
          <ul className="space-y-3">
            {marketCodes.map((code) => (
              <li key={code}>
                <Link
                  href={`/${code}`}
                  aria-current={code === current ? "true" : undefined}
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {markets[code].name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-slate-200 py-4 text-center text-xs text-white">
        Demo build with mock data and illustrative prices.
      </p>
    </footer>
  );
}
