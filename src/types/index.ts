export type MarketCode = "ng" | "us" | "uk" | "ca";
export type CurrencyCode = "NGN" | "USD" | "GBP" | "CAD";

export type CategorySlug = "digital" | "gifts" | "create" | "studio" | "prints";

export interface Market {
  code: MarketCode;
  name: string;
  currency: CurrencyCode;
  locale: string;
  rate: number;
  taxRate: number;
  hero: {
    title: string;
    subtitle: string;
  };
  featuredSlugs: string[];
}

export interface ServiceOption {
  id: string;
  label: string;
  priceModifier: number;
}

export interface ServiceOptionGroup {
  id: string;
  label: string;
  options: ServiceOption[];
}

export interface Service {
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  basePrice: number;
  discountPercent?: number;
  images: string[];
  included: string[];
  turnaround: string;
  turnaroundDays: number;
  popularity: number;
  useCase: "business" | "events" | "gifting" | "personal";
  industry: "retail" | "tech" | "food" | "general";
  optionGroups: ServiceOptionGroup[];
  relatedSlugs: string[];
}

export interface CartItem {
  key: string;
  slug: string;
  name: string;
  image: string;
  unitPriceUsd: number;
  quantity: number;
  selectedOptions: Record<string, string>;
}
