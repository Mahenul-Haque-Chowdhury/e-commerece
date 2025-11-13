import raw from "@/data/products.json";
import type { Product } from "@/lib/types";

const products = raw as unknown as Product[];

export function listProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function searchProducts(term: string): Product[] {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
  );
}

export function listCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function listBrands(): string[] {
  return Array.from(new Set(products.map((p) => p.brand)));
}
