import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderConfirmation } from "@/components/order-confirmation";
import { isMarketCode, markets } from "@/lib/market";

export const metadata: Metadata = {
  title: "Order confirmed | Branda",
  robots: { index: false },
};

export default async function ConfirmedPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Order confirmation</h1>
      <OrderConfirmation market={markets[code]} />
    </div>
  );
}
