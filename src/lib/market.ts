import type { Market, MarketCode } from "@/types";

export const markets: Record<MarketCode, Market> = {
  ng: {
    code: "ng",
    name: "Nigeria",
    currency: "NGN",
    locale: "en-NG",
    rate: 1500,
    taxRate: 0.075,
    hero: {
      title: "Brand your business, the Naija way",
      subtitle:
        "Logos, packaging and prints delivered across Lagos, Abuja and beyond.",
    },
    featuredSlugs: ["logo-design", "business-cards", "event-backdrops"],
  },
  us: {
    code: "us",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    rate: 1,
    taxRate: 0.08,
    hero: {
      title: "Branding that makes your business stand out",
      subtitle: "From logo design to custom merch, shipped coast to coast.",
    },
    featuredSlugs: ["logo-design", "branded-mugs", "brand-identity-kit"],
  },
  uk: {
    code: "uk",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    rate: 0.79,
    taxRate: 0.2,
    hero: {
      title: "Professional branding for UK businesses",
      subtitle: "Design, print and gifting, delivered across the UK.",
    },
    featuredSlugs: ["business-cards", "branded-mugs", "social-media-kit"],
  },
  ca: {
    code: "ca",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    rate: 1.36,
    taxRate: 0.13,
    hero: {
      title: "Your brand, from coast to coast",
      subtitle: "Branding, print and studio services for Canadian businesses.",
    },
    featuredSlugs: ["logo-design", "event-backdrops", "branded-tote-bags"],
  },
};

export const marketCodes = Object.keys(markets) as MarketCode[];

export function isMarketCode(value: string): value is MarketCode {
  return value in markets;
}
