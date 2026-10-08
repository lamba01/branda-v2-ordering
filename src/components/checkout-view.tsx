"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderSummary } from "@/components/order-summary";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { useCart } from "@/store/cart";
import { useOrder } from "@/store/order";
import type { Market } from "@/types";

type Errors = { name?: string; email?: string };

const inputClass =
  "w-full rounded-md border bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-indigo-700";

export function CheckoutView({ market }: { market: Market }) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const setOrder = useOrder((s) => s.setOrder);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [placed, setPlaced] = useState(false);

  function validate(): Errors {
    const found: Errors = {};
    if (name.trim().length < 2) found.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      found.email = "Enter a valid email address.";
    }
    return found;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setOrder({
      id: `BR-${Date.now().toString(36).toUpperCase()}`,
      market: market.code,
      name: name.trim(),
      email: email.trim(),
      items,
    });
    setPlaced(true); // stops the page flashing "empty cart" while we navigate
    router.push(`/${market.code}/checkout/confirmed`);
    clear();
  }

  if (placed) {
    return (
      <p role="status" className="text-slate-700">
        Placing your order…
      </p>
    );
  }

  if (!hydrated) {
    return (
      <div aria-busy="true" className="grid gap-8 lg:grid-cols-2">
        <span className="sr-only" role="status">
          Loading checkout
        </span>
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Nothing to check out yet
        </h2>
        <p className="mt-1 text-slate-600">Your cart is empty.</p>
        <Link
          href={`/${market.code}/services`}
          className="mt-4 inline-block rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          Browse services
        </Link>
      </div>
    );
  }

  const hasErrors = Boolean(errors.name || errors.email);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-900">Your details</h2>

        {hasErrors && (
          <p
            role="alert"
            className="rounded-md bg-rose-50 p-3 text-sm text-rose-900"
          >
            Please fix the highlighted fields.
          </p>
        )}

        <div>
          <label
            htmlFor="co-name"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            Full name
          </label>
          <input
            id="co-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "co-name-error" : undefined}
            className={`${inputClass} ${errors.name ? "border-rose-600" : "border-slate-300"}`}
          />
          {errors.name && (
            <p id="co-name-error" className="mt-1 text-sm text-rose-800">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="co-email"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            Email address
          </label>
          <input
            id="co-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "co-email-error" : undefined}
            className={`${inputClass} ${errors.email ? "border-rose-600" : "border-slate-300"}`}
          />
          {errors.email && (
            <p id="co-email-error" className="mt-1 text-sm text-rose-800">
              {errors.email}
            </p>
          )}
        </div>

        <p className="text-sm text-slate-600">
          This is a demo. No payment is taken and nothing is sent.
        </p>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          Confirm order
        </button>
        <Link
          href={`/${market.code}/cart`}
          className="block text-center text-sm font-medium text-indigo-700 underline underline-offset-2"
        >
          Back to cart
        </Link>
      </form>

      <OrderSummary items={items} market={market} showItems />
    </div>
  );
}
