import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const now = new Date().toISOString();
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
  for (const p of listProducts()) {
    urls.push({
      url: `${base}/product/${p.slug}`,
      lastModified: p.createdAt || now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  return urls;
}
