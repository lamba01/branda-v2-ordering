import { notFound } from "next/navigation";
import { CartHydrator } from "@/components/cart-hydrator";
import { Header } from "@/components/header";
import { isMarketCode, marketCodes, markets } from "@/lib/market";
import { Footer } from "@/components/footer";

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
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-indigo-700"
      >
        Skip to content
      </a>
      <CartHydrator />
      <Header market={markets[code]} />
      <main id="main" className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
      <Footer current={code} />
    </>
  );
}
