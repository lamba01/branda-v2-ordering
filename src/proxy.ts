import { NextResponse, type NextRequest } from "next/server";

const countryToMarket: Record<string, string> = {
  NG: "ng",
  US: "us",
  GB: "uk",
  CA: "ca",
};

export function proxy(request: NextRequest) {
  // Vercel adds this header with the visitor's country code
  const country =
    request.headers.get("x-vercel-ip-country")?.toUpperCase() ?? "";
  const market = countryToMarket[country] ?? "ng";

  return NextResponse.redirect(new URL(`/${market}`, request.url));
}

export const config = {
  matcher: "/",
};
