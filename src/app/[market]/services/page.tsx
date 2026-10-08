import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FilterBar } from "@/components/filter-bar";
import { Pagination } from "@/components/pagination";
import { ServiceCard } from "@/components/service-card";
import { CATEGORY_SLUGS, categoryLabels } from "@/lib/constants";
import { isMarketCode, markets } from "@/lib/market";
import { getServices, parseFilters } from "@/lib/services";
import { buildServicesHref } from "@/lib/url";

type Props = {
  params: Promise<{ market: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { market: code } = await params;
  if (!isMarketCode(code)) return {};

  const filters = parseFilters(await searchParams);
  const label = filters.category ? categoryLabels[filters.category] : "All";

  return {
    title: `${label} branding services | Branda ${markets[code].name}`,
    description: `Browse ${label.toLowerCase()} branding services in ${markets[code].name}. Logos, prints, gifts and more.`,
  };
}

export default async function ServicesPage({ params, searchParams }: Props) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();

  const market = markets[code];
  const filters = parseFilters(await searchParams);
  const result = await getServices(filters);

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold text-slate-900">Branding services</h1>

      <nav aria-label="Categories">
        <ul className="flex flex-wrap gap-2">
          {[undefined, ...CATEGORY_SLUGS].map((cat) => {
            const active = filters.category === cat;
            return (
              <li key={cat ?? "all"}>
                <Link
                  href={buildServicesHref(code, {
                    ...filters,
                    category: cat,
                    page: 1,
                  })}
                  aria-current={active ? "true" : undefined}
                  className={
                    active
                      ? "inline-block rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white"
                      : "inline-block rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-700"
                  }
                >
                  {cat ? categoryLabels[cat] : "All"}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Suspense fallback={<div className="h-40" />}>
        <FilterBar filters={filters} />
      </Suspense>

      <p aria-live="polite" className="text-sm text-slate-600">
        {result.total} {result.total === 1 ? "service" : "services"} found
      </p>

      {result.items.length === 0 ? (
        <div className="rounded-xl w-full sm:w-[96vw] border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No services match your search
          </h2>
          <p className="mt-1 text-slate-600">
            Try different keywords or remove some filters.
          </p>
          <Link
            href={`/${code}/services`}
            className="mt-4 inline-block rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
          >
            Clear all filters
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {result.items.map((service, index) => (
            <li key={service.slug} className="flex">
              <div className="flex w-full">
                <ServiceCard
                  service={service}
                  market={market}
                  priority={index < 4}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        market={code}
        filters={filters}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
