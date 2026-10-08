import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutView } from "@/components/checkout-view";
import { isMarketCode, markets } from "@/lib/market";

export const metadata: Metadata = {
  title: "Checkout | Branda",
  robots: { index: false },
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      <CheckoutView market={markets[code]} />
    </div>
  );
}
