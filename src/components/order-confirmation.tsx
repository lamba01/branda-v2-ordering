"use client";

import Link from "next/link";
import { OrderSummary } from "@/components/order-summary";
import { useOrder } from "@/store/order";
import type { Market } from "@/types";

export function OrderConfirmation({ market }: { market: Market }) {
  const order = useOrder((s) => s.order);

  if (!order || order.market !== market.code) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          No recent order found
        </h2>
        <p className="mt-1 text-slate-600">
          If you just placed one, it may have been cleared on refresh.
        </p>
        <Link
          href={`/${market.code}/services`}
          className="mt-4 inline-block rounded-md bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
        >
          Browse services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div role="status" className="rounded-xl bg-emerald-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-emerald-900">Order confirmed</h2>
        <p className="mt-2 text-emerald-900">
          Thank you, {order.name}. Your order <strong>{order.id}</strong> has
          been received.
        </p>
        <p className="mt-1 text-sm text-emerald-900">
          A confirmation would be sent to {order.email}.
        </p>
      </div>

      <OrderSummary items={order.items} market={market} showItems />

      <div className="text-center">
        <Link
          href={`/${market.code}/services`}
          className="inline-block rounded-md bg-indigo-700 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
