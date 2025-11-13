import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/products";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();
  return <ProductDetailClient product={product} />;
}
