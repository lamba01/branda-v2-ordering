import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isMarketCode, marketCodes, markets } from "@/lib/market";

export const dynamicParams = false;

const pages = {
  "how-it-works": {
    title: "How it works",
    intro: "Ordering branding services takes three simple steps.",
    points: [
      "Browse services by category and pick the one that fits your business.",
      "Choose your options, set the quantity and add it to your cart.",
      "Confirm your order and our team gets started on your brief.",
    ],
  },
  about: {
    title: "About Branda",
    intro: "Branda is a branding ecosystem, not a marketplace.",
    points: [
      "Digital, gifts, create, studio and prints, all in one place.",
      "Serving businesses in Nigeria, the USA, the UK and Canada.",
      "This page is placeholder content for the screening demo.",
    ],
  },
  contact: {
    title: "Contact us",
    intro: "Have a question about an order or a custom request?",
    points: [
      "Contact details would appear here in the full product.",
      "This page is placeholder content for the screening demo.",
    ],
  },
} as const;

type PageSlug = keyof typeof pages;

function isPageSlug(value: string): value is PageSlug {
  return value in pages;
}

type Props = { params: Promise<{ market: string; page: string }> };

export function generateStaticParams() {
  return marketCodes.flatMap((market) =>
    Object.keys(pages).map((page) => ({ market, page })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market: code, page } = await params;
  if (!isMarketCode(code) || !isPageSlug(page)) return {};

  return {
    title: `${pages[page].title} | Branda ${markets[code].name}`,
    description: pages[page].intro,
    alternates: { canonical: `/${code}/${page}` },
  };
}

export default async function InfoPage({ params }: Props) {
  const { market: code, page } = await params;
  if (!isMarketCode(code) || !isPageSlug(page)) notFound();

  const content = pages[page];

  return (
    <div className="mx-auto max-w-2xl h-1/2 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
      <p className="text-lg text-slate-700">{content.intro}</p>
      <ul className="list-disc space-y-2 pl-5 text-slate-700">
        {content.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <Link
        href={`/${code}/services`}
        className="inline-block rounded-md bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
      >
        Browse services
      </Link>
    </div>
  );
}
