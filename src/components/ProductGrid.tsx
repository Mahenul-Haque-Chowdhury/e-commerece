import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((p, idx) => (
        <div key={p.id} className={`reveal-card reveal-delay-${(idx % 4) + 1}`}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
