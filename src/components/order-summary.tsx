import { formatPrice } from "@/lib/format";
import { computeTotals } from "@/lib/totals";
import type { CartItem, Market } from "@/types";

export function OrderSummary({
  items,
  market,
  showItems = false,
}: {
  items: CartItem[];
  market: Market;
  showItems?: boolean;
}) {
  const totals = computeTotals(items, market.taxRate);
  const taxPercent = +(market.taxRate * 100).toFixed(1);

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 id="summary-heading" className="text-lg font-semibold text-slate-900">
        Order summary
      </h2>

      {showItems && (
        <ul className="mt-4 divide-y divide-slate-200">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex justify-between gap-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                {Object.entries(item.selectedOptions).map(([label, value]) => (
                  <p key={label} className="text-slate-600">
                    {label}: {value}
                  </p>
                ))}
                <p className="text-slate-600">
                  {item.quantity} × {formatPrice(item.unitPriceUsd, market)}
                </p>
              </div>
              <p className="font-medium text-slate-900">
                {formatPrice(item.unitPriceUsd * item.quantity, market)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-700">Subtotal</dt>
          <dd className="text-slate-900">
            {formatPrice(totals.subtotalUsd, market)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-700">Tax ({taxPercent}%)</dt>
          <dd className="text-slate-900">
            {formatPrice(totals.taxUsd, market)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
          <dt className="text-slate-900">Total</dt>
          <dd className="text-slate-900">
            {formatPrice(totals.totalUsd, market)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
