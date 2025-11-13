"use client";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden rounded">
          <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg md:text-xl font-medium leading-tight">
            {product.title}
          </h3>
          <div className="mt-2 text-base md:text-lg font-semibold">{formatCurrency(product.price)}</div>
        </div>
      </Link>
    </div>
  );
}
