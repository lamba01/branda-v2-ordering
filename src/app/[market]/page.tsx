import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { isMarketCode, markets } from "@/lib/market";
import { getFinalPrice, getServices, parseFilters } from "@/lib/services";

export default async function MarketHome({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();

  const market = markets[code];
  const result = await getServices(parseFilters({ sort: "price-asc" }));

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{market.hero.title}</h1>
      <p>{market.hero.subtitle}</p>
      <ul className="mt-4 space-y-1">
        {result.items.map((s) => (
          <li key={s.slug}>
            {s.name}: {formatPrice(getFinalPrice(s), market)}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        {result.total} services, {result.totalPages} pages
      </p>
    </main>
  );
}
