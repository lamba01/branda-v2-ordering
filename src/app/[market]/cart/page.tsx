import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartView } from "@/components/cart-view";
import { isMarketCode, markets } from "@/lib/market";

export const metadata: Metadata = {
  title: "Your cart | Branda",
  robots: { index: false },
};

export default async function CartPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Your cart</h1>
      <CartView market={markets[code]} />
    </div>
  );
}
