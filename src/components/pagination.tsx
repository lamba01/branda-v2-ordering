import Link from "next/link";
import { buildServicesHref } from "@/lib/url";
import type { MarketCode, ServiceFilters } from "@/types";

export function Pagination({
  market,
  filters,
  page,
  totalPages,
}: {
  market: MarketCode;
  filters: ServiceFilters;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const linkClass =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-700";
  const disabledClass =
    "rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={buildServicesHref(market, { ...filters, page: page - 1 })}
          rel="prev"
          className={linkClass}
        >
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Previous
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={buildServicesHref(market, { ...filters, page: n })}
          aria-label={`Page ${n}`}
          aria-current={n === page ? "page" : undefined}
          className={
            n === page
              ? "rounded-md bg-indigo-700 px-3 py-2 text-sm font-semibold text-white"
              : linkClass
          }
        >
          {n}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={buildServicesHref(market, { ...filters, page: page + 1 })}
          rel="next"
          className={linkClass}
        >
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Next
        </span>
      )}
    </nav>
  );
}
