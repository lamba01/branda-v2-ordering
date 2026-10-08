import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceCard } from "@/components/service-card";
import { CATEGORY_SLUGS, categoryLabels } from "@/lib/constants";
import { isMarketCode, marketCodes, markets } from "@/lib/market";
import { getServicesBySlugs } from "@/lib/services";
import type { CategorySlug } from "@/types";

type Props = { params: Promise<{ market: string }> };

const categoryBlurbs: Record<CategorySlug, string> = {
  digital: "Logos, social kits and web design",
  gifts: "Mugs, apparel and branded gifts",
  create: "Packaging, decks and brand identity",
  studio: "Photography, video and headshots",
  prints: "Cards, flyers and banners",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market: code } = await params;
  if (!isMarketCode(code)) return {};

  const market = markets[code];
  const title = `Branda ${market.name} | Branding services`;

  return {
    title,
    description: market.hero.subtitle,
    alternates: {
      canonical: `/${code}`,
      languages: {
        ...Object.fromEntries(
          marketCodes.map((m) => [markets[m].locale, `/${m}`]),
        ),
        "x-default": "/us",
      },
    },
    openGraph: {
      title,
      description: market.hero.subtitle,
      url: `/${code}`,
      siteName: "Branda",
      locale: market.locale.replace("-", "_"),
      type: "website",
    },
  };
}

export default async function MarketHome({ params }: Props) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();

  const market = markets[code];
  const featured = await getServicesBySlugs(market.featuredSlugs);

  return (
    <div className="space-y-16">
      <section
        aria-labelledby="hero-heading"
        className="rounded-2xl bg-linear-to-br from-indigo-800 to-indigo-600 px-6 py-14 text-white sm:px-12 sm:py-20"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">
          Branda {market.name}
        </p>
        <h1
          id="hero-heading"
          className="mt-3 max-w-2xl text-3xl font-bold sm:text-5xl"
        >
          {market.hero.title}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-indigo-50">
          {market.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${code}/services`}
            className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-indigo-800 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Browse all services
          </Link>
          <Link
            href={`/${code}/services?sort=price-asc`}
            className="rounded-md border border-white px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See lowest prices
          </Link>
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="text-2xl font-bold text-slate-900"
        >
          Shop by category
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                href={`/${code}/services?category=${slug}`}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
              >
                <span className="text-lg font-semibold text-slate-900">
                  {categoryLabels[slug]}
                </span>
                <span className="mt-1 text-sm text-slate-600">
                  {categoryBlurbs[slug]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-2xl font-bold text-slate-900">
          Featured in {market.name}
        </h2>
        <p className="mt-1 text-slate-600">
          Popular picks for businesses in your market.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, index) => (
            <li key={service.slug} className="flex">
              <div className="flex w-full">
                <ServiceCard
                  service={service}
                  market={market}
                  priority={index === 0}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
