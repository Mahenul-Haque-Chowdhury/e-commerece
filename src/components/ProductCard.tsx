"use client";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const badges = product.badges || [];
  return (
    <div className="group card-base card-hover overflow-hidden flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full aspect-4/3 bg-(--background-alt) overflow-hidden rounded-md">
          <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          {badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {badges.map(b => (
                <span key={b} className="pill px-2 py-1 text-[10px] font-semibold tracking-wide bg-(--accent) text-white shadow-sm opacity-90">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 text-center flex flex-col items-center">
          <h3 className="text-sm md:text-base font-medium leading-snug line-clamp-2">{product.title}</h3>
          <div className="mt-2 text-sm md:text-base font-semibold text-(--accent)">{formatCurrency(product.price)}</div>
        </div>
      </Link>
    </div>
  );
}
