"use client";

import Image from "next/image";
import Link from "next/link";
import { OrderSummary } from "@/components/order-summary";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Market } from "@/types";

const stepButton =
  "px-3 py-1.5 text-lg text-slate-800 hover:bg-slate-100 disabled:text-slate-400 focus-visible:outline-2 focus-visible:outline-indigo-700";

export function CartView({ market }: { market: Market }) {
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);

  if (!hydrated) {
    return (
      <div aria-busy="true" className="space-y-4">
        <span className="sr-only" role="status">
          Loading your cart
        </span>
        <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Your cart is empty
        </h2>
        <p className="mt-1 text-slate-600">
          Browse our services and add something to get started.
        </p>
        <Link
          href={`/${market.code}/services`}
          className="mt-4 inline-block rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          Browse services
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-md bg-slate-100">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row">
              <div>
                <Link
                  href={`/${market.code}/services/${item.slug}`}
                  className="font-semibold text-slate-900 hover:underline"
                >
                  {item.name}
                </Link>
                {Object.entries(item.selectedOptions).map(([label, value]) => (
                  <p key={label} className="text-sm text-slate-600">
                    {label}: {value}
                  </p>
                ))}
                <p className="mt-1 text-sm text-slate-700">
                  {formatPrice(item.unitPriceUsd, market)} each
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="inline-flex items-center rounded-md border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.key, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className={stepButton}
                  >
                    −
                  </button>
                  <span
                    aria-live="polite"
                    aria-label={`Quantity ${item.quantity}`}
                    className="w-10 text-center text-sm font-medium text-slate-900"
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.key, item.quantity + 1)}
                    disabled={item.quantity >= 99}
                    aria-label={`Increase quantity of ${item.name}`}
                    className={stepButton}
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    {formatPrice(item.unitPriceUsd * item.quantity, market)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-sm font-medium text-rose-700 underline underline-offset-2 hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-rose-700"
                  >
                    Remove<span className="sr-only"> {item.name}</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <OrderSummary items={items} market={market} />
        <Link
          href={`/${market.code}/checkout`}
          className="block rounded-md bg-indigo-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          Proceed to checkout
        </Link>
        <Link
          href={`/${market.code}/services`}
          className="block text-center text-sm font-medium text-indigo-700 underline underline-offset-2"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
