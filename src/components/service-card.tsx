import Image from "next/image";
import Link from "next/link";
import { categoryLabels } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { getFinalPrice } from "@/lib/services";
import type { Market, Service } from "@/types";

export function ServiceCard({
  service,
  market,
  priority = false,
  headingLevel = 2,
}: {
  service: Service;
  market: Market;
  priority?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const finalPrice = getFinalPrice(service);

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-48 w-full shrink-0 bg-slate-100">
        <Image
          src={service.images[0]}
          alt={`${service.name} example`}
          fill
          sizes="288px"
          priority={priority}
          className="object-cover"
        />
        {service.discountPercent ? (
          <span className="absolute left-3 top-3 rounded-full bg-rose-700 px-2.5 py-1 text-xs font-semibold text-white">
            {service.discountPercent}% off
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
          {categoryLabels[service.category]}
        </p>
        <Heading className="mt-1 line-clamp-2 h-14 text-lg font-semibold text-slate-900">
          {service.name}
        </Heading>
        <p className="mt-1 line-clamp-2 h-10 text-sm text-slate-600">
          {service.description}
        </p>

        <div className="mt-4 h-8">
          <span className="text-sm text-slate-600">From </span>
          <span className="text-xl font-bold text-slate-900">
            {formatPrice(finalPrice, market)}
          </span>
          {service.discountPercent ? (
            <>
              <span className="sr-only"> Original price </span>
              <span className="ml-2 text-sm text-slate-500 line-through">
                {formatPrice(service.basePrice, market)}
              </span>
            </>
          ) : null}
        </div>

        <Link
          href={`/${market.code}/services/${service.slug}`}
          className="mt-auto inline-flex items-center justify-center rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          View details<span className="sr-only">: {service.name}</span>
        </Link>
      </div>
    </article>
  );
}
