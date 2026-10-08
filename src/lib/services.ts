import { services } from "@/data/services";
import { getFinalPrice } from "@/lib/pricing";
import type {
  CategorySlug,
  PaginatedServices,
  Service,
  ServiceFilters,
  SortOption,
  Urgency,
} from "@/types";

export const PAGE_SIZE = 8;

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

// /** Price in base USD after any discount */
// export function getFinalPrice(service: Service): number {
//   return service.discountPercent
//     ? service.basePrice * (1 - service.discountPercent / 100)
//     : service.basePrice;
// }
export { getFinalPrice };

// Returns the value only if it is one of the allowed options, otherwise undefined
function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  return allowed.find((item) => item === value);
}

type RawSearchParams = Record<string, string | string[] | undefined>;

/** Turns the URL search params into a safe, typed filters object */
export function parseFilters(raw: RawSearchParams): ServiceFilters {
  const pick = (key: string): string | undefined => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const page = Number.parseInt(pick("page") ?? "1", 10);

  return {
    q: pick("q")?.trim() || undefined,
    category: oneOf(pick("category"), CATEGORY_SLUGS),
    useCase: oneOf(pick("useCase"), USE_CASES),
    industry: oneOf(pick("industry"), INDUSTRIES),
    urgency: oneOf(pick("urgency"), URGENCIES),
    sort: oneOf<SortOption>(pick("sort"), SORTS) ?? "popular",
    page: Number.isNaN(page) || page < 1 ? 1 : page,
  };
}

function matchesUrgency(days: number, urgency: Urgency): boolean {
  if (urgency === "fast") return days <= 3;
  if (urgency === "standard") return days >= 4 && days <= 7;
  return days >= 8;
}

// async on purpose: it behaves like a real API call and makes loading.tsx meaningful
export async function getServices(
  filters: ServiceFilters,
): Promise<PaginatedServices> {
  const terms = filters.q?.toLowerCase().split(/\s+/).filter(Boolean) ?? [];

  const filtered = services.filter((s) => {
    if (filters.category && s.category !== filters.category) return false;
    if (filters.useCase && s.useCase !== filters.useCase) return false;
    if (filters.industry && s.industry !== filters.industry) return false;
    if (filters.urgency && !matchesUrgency(s.turnaroundDays, filters.urgency))
      return false;

    if (terms.length > 0) {
      const haystack =
        `${s.name} ${s.description} ${s.category} ${s.useCase} ${s.industry}`.toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (filters.sort === "price-asc")
      return getFinalPrice(a) - getFinalPrice(b);
    if (filters.sort === "price-desc")
      return getFinalPrice(b) - getFinalPrice(a);
    return b.popularity - a.popularity;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    total,
    page,
    totalPages,
  };
}

export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  return services.find((s) => s.slug === slug);
}

export async function getServicesBySlugs(slugs: string[]): Promise<Service[]> {
  return slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => s !== undefined);
}

/** Related services, preferring other categories so people bundle across the platform */
export async function getRelatedServices(
  service: Service,
  limit = 4,
): Promise<Service[]> {
  const listed = await getServicesBySlugs(service.relatedSlugs);
  const picked = listed.filter((s) => s.slug !== service.slug);

  if (picked.length >= limit) return picked.slice(0, limit);

  const fillers = services
    .filter(
      (s) =>
        s.slug !== service.slug &&
        !picked.some((p) => p.slug === s.slug) &&
        s.useCase === service.useCase,
    )
    .sort(
      (a, b) =>
        Number(b.category !== service.category) -
        Number(a.category !== service.category),
    );

  return [...picked, ...fillers].slice(0, limit);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
