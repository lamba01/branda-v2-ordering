import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { PurchasePanel } from "@/components/purchase-panel";
import { ServiceCard } from "@/components/service-card";
import { categoryLabels } from "@/lib/constants";
import { isMarketCode, marketCodes, markets } from "@/lib/market";
import { getFinalPrice } from "@/lib/pricing";
import {
  getAllServiceSlugs,
  getRelatedServices,
  getServiceBySlug,
} from "@/lib/services";

export const dynamicParams = false;

type Props = { params: Promise<{ market: string; slug: string }> };

// Pre-render every service in every market at build time (SSG)
export function generateStaticParams() {
  return marketCodes.flatMap((market) =>
    getAllServiceSlugs().map((slug) => ({ market, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market: code, slug } = await params;
  if (!isMarketCode(code)) return {};

  const service = await getServiceBySlug(slug);
  if (!service) return {};

  const market = markets[code];
  const title = `${service.name} | Branda ${market.name}`;
  const description = `${service.description} Turnaround: ${service.turnaround}.`;
  const path = `/${code}/services/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      // hreflang: tells search engines which URL serves which market
      languages: {
        ...Object.fromEntries(
          marketCodes.map((m) => [markets[m].locale, `/${m}/services/${slug}`]),
        ),
        "x-default": `/us/services/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Branda",
      locale: market.locale.replace("-", "_"),
      type: "website",
      images: [
        { url: service.images[0], width: 800, height: 600, alt: service.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [service.images[0]],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { market: code, slug } = await params;
  if (!isMarketCode(code)) notFound();

  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const market = markets[code];
  const related = await getRelatedServices(service, 4);

  // Structured data so search engines can show price in results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: service.name,
    description: service.description,
    image: service.images,
    offers: {
      "@type": "Offer",
      priceCurrency: market.currency,
      price: (getFinalPrice(service) * market.rate).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <li>
            <Link
              href={`/${code}/services`}
              className="underline underline-offset-2 hover:text-slate-900"
            >
              Services
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${code}/services?category=${service.category}`}
              className="underline underline-offset-2 hover:text-slate-900"
            >
              {categoryLabels[service.category]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-900">
            {service.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <Gallery images={service.images} name={service.name} />

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {categoryLabels[service.category]}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {service.name}
            </h1>
            <p className="mt-3 text-slate-700">{service.description}</p>
          </div>

          <PurchasePanel service={service} market={market} />

          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-semibold text-slate-900">
                Turnaround
              </dt>
              <dd className="mt-1 text-slate-700">{service.turnaround}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-slate-900">
                What&apos;s included
              </dt>
              <dd className="mt-1">
                <ul className="space-y-1 text-slate-700">
                  {service.included.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-emerald-700">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Complete your brand
          </h2>
          <p className="mt-1 text-slate-600">
            Services that pair well with {service.name}.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.slug} className="flex">
                <div className="flex w-full">
                  <ServiceCard
                    service={item}
                    market={market}
                    headingLevel={3}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
