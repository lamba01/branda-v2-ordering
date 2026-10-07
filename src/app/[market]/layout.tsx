import { notFound } from "next/navigation";
import { isMarketCode, marketCodes } from "@/lib/market";

export const dynamicParams = false;

export function generateStaticParams() {
  return marketCodes.map((market) => ({ market }));
}

export default async function MarketLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isMarketCode(market)) notFound();

  return <>{children}</>;
}
