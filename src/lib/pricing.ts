import type { Service } from "@/types";

const round2 = (n: number) => Math.round(n * 100) / 100;

export function getFinalPrice(service: Service): number {
  return service.discountPercent
    ? round2(service.basePrice * (1 - service.discountPercent / 100))
    : service.basePrice;
}

function optionsTotal(
  service: Service,
  selected: Record<string, string>,
): number {
  return service.optionGroups.reduce((sum, group) => {
    const option = group.options.find((o) => o.id === selected[group.id]);
    return sum + (option?.priceModifier ?? 0);
  }, 0);
}

export function getListUnitPrice(
  service: Service,
  selected: Record<string, string>,
): number {
  return service.basePrice + optionsTotal(service, selected);
}

export function getUnitPrice(
  service: Service,
  selected: Record<string, string>,
): number {
  const list = getListUnitPrice(service, selected);
  return service.discountPercent
    ? round2(list * (1 - service.discountPercent / 100))
    : list;
}
