"use client";
import products from "@/data/products.json";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useCart } from "@/stores/cart";
import { formatBDT } from "@/lib/utils";
import { useState } from "react";

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = (products as typeof products).find(p => p.slug === params.slug);
  const { add } = useCart();
  const [active, setActive] = useState(0);
  if (!product) return notFound();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-8">
      <div>
        <div className="relative aspect-square bg-slate-100 overflow-hidden rounded">
          <Image src={product.images[active]} alt={product.title} fill className="object-cover" />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {product.images.slice(0,4).map((src,i)=>(
            <button key={i} onClick={()=>setActive(i)} className={`relative aspect-square overflow-hidden rounded border ${active===i? 'border-sky-500':'border-transparent'}`}>
              <Image src={src} alt={`${product.title} ${i+1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p className="mt-2 text-slate-700">{product.description}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-lg font-medium">{formatBDT(product.price)}</span>
          {product.compareAtPrice && <span className="text-slate-500 line-through">{formatBDT(product.compareAtPrice)}</span>}
        </div>
        <button onClick={()=>add(product.id,1)} className="mt-6 bg-slate-900 text-white px-6 py-3 rounded">Add to Cart</button>
      </div>

      {/* Sticky add to cart bar */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto max-w-2xl bg-white border shadow-lg rounded-full px-4 py-2 flex items-center justify-between gap-4">
        <div className="truncate">{product.title}</div>
        <div className="flex items-center gap-3">
          <span className="font-semibold">{formatBDT(product.price)}</span>
          <button onClick={()=>add(product.id,1)} className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
