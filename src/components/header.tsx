"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Market } from "@/types";
import { CartLink } from "./cart-link";
import { MarketSwitcher } from "./market-switcher";

const links = [
  { path: "services", label: "Services" },
  { path: "how-it-works", label: "How it works" },
  { path: "about", label: "About" },
  { path: "contact", label: "Contact" },
];

const linkClass =
  "block rounded-md px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white";

export function Header({ market }: { market: Market }) {
  const [open, setOpen] = useState(false);

  return (
    <header className=" z-40 bg-indigo-900 text-white shadow-md sticky top-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <Link
          href={`/${market.code}`}
          className="text-xl font-bold focus-visible:outline-2 focus-visible:outline-white"
        >
          Branda
        </Link>

        {/* Desktop links, hidden on mobile */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1">
            {links.map((l) => (
              <li key={l.path}>
                <Link href={`/${market.code}/${l.path}`} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden md:block">
            <MarketSwitcher current={market.code} />
          </div>

          <CartLink market={market.code} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className=" cursor-pointer inline-flex min-h-11 min-w-11 items-center justify-center rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white md:hidden"
          >
            {open ? (
              <X aria-hidden="true" size={22} />
            ) : (
              <Menu aria-hidden="true" size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown, only rendered when open */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-t border-white/10 bg-indigo-900 shadow-lg md:hidden pb-3 sm:pb-0"
        >
          <ul className="space-y-1 px-4 py-3">
            {links.map((l) => (
              <li key={l.path}>
                <Link
                  href={`/${market.code}/${l.path}`}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <MarketSwitcher current={market.code} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
