import type { CategorySlug, Service, SortOption, Urgency } from "@/types";

export const CATEGORY_SLUGS = [
  "digital",
  "gifts",
  "create",
  "studio",
  "prints",
] as const;
export const USE_CASES = ["business", "events", "gifting", "personal"] as const;
export const INDUSTRIES = ["retail", "tech", "food", "general"] as const;
export const URGENCIES = ["fast", "standard", "extended"] as const;
export const SORTS = ["popular", "price-asc", "price-desc"] as const;

export const categoryLabels: Record<CategorySlug, string> = {
  digital: "Digital",
  gifts: "Gifts",
  create: "Create",
  studio: "Studio",
  prints: "Prints",
};

export const useCaseLabels: Record<Service["useCase"], string> = {
  business: "Business",
  events: "Events",
  gifting: "Gifting",
  personal: "Personal",
};

export const industryLabels: Record<Service["industry"], string> = {
  retail: "Retail",
  tech: "Tech",
  food: "Food and drink",
  general: "General",
};

export const urgencyLabels: Record<Urgency, string> = {
  fast: "Fast (3 days or less)",
  standard: "Standard (4 to 7 days)",
  extended: "Extended (8+ days)",
};

export const sortLabels: Record<SortOption, string> = {
  popular: "Most popular",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};
