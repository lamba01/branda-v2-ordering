"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { getListUnitPrice, getUnitPrice } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import type { Market, Service } from "@/types";

const clamp = (n: number) => Math.min(99, Math.max(1, n));

export function PurchasePanel({
  service,
  market,
}: {
  service: Service;
  market: Market;
}) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);

  // default to the first option in every group
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      service.optionGroups.map((g) => [g.id, g.options[0].id]),
    ),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const unit = getUnitPrice(service, selected);
  const listUnit = getListUnitPrice(service, selected);
  const total = unit * quantity;

  function selectOption(groupId: string, optionId: string) {
    setSelected((prev) => ({ ...prev, [groupId]: optionId }));
    setAdded(false);
  }

  function changeQuantity(next: number) {
    if (Number.isNaN(next)) return;
    setQuantity(clamp(next));
    setAdded(false);
  }

  function buildItem() {
    const labels: Record<string, string> = {};
    const idParts: string[] = [];

    for (const group of service.optionGroups) {
      const option = group.options.find((o) => o.id === selected[group.id]);
      if (option) {
        labels[group.label] = option.label; // shown in the cart
        idParts.push(`${group.id}:${option.id}`);
      }
    }

    return {
      key: [service.slug, ...idParts].join("|"),
      slug: service.slug,
      name: service.name,
      image: service.images[0],
      unitPriceUsd: unit,
      selectedOptions: labels,
    };
  }

  function handleAdd() {
    addItem(buildItem(), quantity);
    setAdded(true);
  }

  function handleOrderNow() {
    addItem(buildItem(), quantity);
    router.push(`/${market.code}/checkout`);
  }

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <span className="text-3xl font-bold text-slate-900">
          {formatPrice(unit, market)}
        </span>
        {service.discountPercent ? (
          <>
            <span className="sr-only"> Original price </span>
            <span className="ml-2 text-base text-slate-500 line-through">
              {formatPrice(listUnit, market)}
            </span>
            <span className="ml-2 rounded-full bg-rose-700 px-2.5 py-1 text-xs font-semibold text-white">
              {service.discountPercent}% off
            </span>
          </>
        ) : null}
        <p className="mt-1 text-sm text-slate-600">per unit, before tax</p>
      </div>

      {service.optionGroups.map((group) => (
        <fieldset key={group.id}>
          <legend className="mb-2 text-sm font-medium text-slate-800">
            {group.label}
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const inputId = `${group.id}-${option.id}`;
              return (
                <div key={option.id}>
                  <input
                    id={inputId}
                    type="radio"
                    name={group.id}
                    value={option.id}
                    checked={selected[group.id] === option.id}
                    onChange={() => selectOption(group.id, option.id)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={inputId}
                    className="block cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 peer-checked:border-indigo-700 peer-checked:bg-indigo-50 peer-checked:font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-700"
                  >
                    {option.label}
                    {option.priceModifier > 0 && (
                      <span className="ml-1 text-slate-600">
                        (+{formatPrice(option.priceModifier, market)})
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <label
          htmlFor="qty-input"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Quantity
        </label>
        <div className="inline-flex items-center rounded-md border border-slate-300">
          <button
            type="button"
            onClick={() => changeQuantity(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="px-3 py-2 text-lg text-slate-800 hover:bg-slate-100 disabled:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-700"
          >
            −
          </button>
          <input
            id="qty-input"
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => changeQuantity(Number(e.target.value))}
            className="w-14 border-x border-slate-300 py-2 text-center text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-700"
          />
          <button
            type="button"
            onClick={() => changeQuantity(quantity + 1)}
            disabled={quantity >= 99}
            aria-label="Increase quantity"
            className="px-3 py-2 text-lg text-slate-800 hover:bg-slate-100 disabled:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-700"
          >
            +
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-700">
        Subtotal:{" "}
        <strong className="text-slate-900">{formatPrice(total, market)}</strong>
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleOrderNow}
          className="flex-1 rounded-md bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          Order Now
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-md border border-indigo-700 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          Add to Cart
        </button>
      </div>

      <p role="status" className="min-h-5 text-sm text-emerald-800">
        {added && (
          <>
            Added to your cart.{" "}
            <Link
              href={`/${market.code}/cart`}
              className="font-semibold underline"
            >
              View cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
