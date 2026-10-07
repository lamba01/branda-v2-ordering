import type { MarketCode, ServiceFilters } from "@/types";

export function buildServicesHref(
  market: MarketCode,
  filters: Partial<ServiceFilters>,
): string {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.useCase) params.set("useCase", filters.useCase);
  if (filters.industry) params.set("industry", filters.industry);
  if (filters.urgency) params.set("urgency", filters.urgency);
  if (filters.sort && filters.sort !== "popular")
    params.set("sort", filters.sort);
  if (filters.page && filters.page > 1)
    params.set("page", String(filters.page));

  const query = params.toString();
  return `/${market}/services${query ? `?${query}` : ""}`;
}
