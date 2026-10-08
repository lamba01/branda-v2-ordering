import type { MetadataRoute } from "next";
import { marketCodes } from "@/lib/market";
import { getAllServiceSlugs } from "@/lib/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return marketCodes.flatMap((market) => [
    {
      url: `${siteUrl}/${market}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/${market}/services`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...getAllServiceSlugs().map((slug) => ({
      url: `${siteUrl}/${market}/services/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...["how-it-works", "about", "contact"].map((page) => ({
      url: `${siteUrl}/${market}/${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ]);
}
