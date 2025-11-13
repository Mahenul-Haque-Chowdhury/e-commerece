"use client";
import { useUI } from "@/stores/ui";
import rawProducts from "@/data/products.json";
import type { Product } from "@/lib/types";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "@/stores/cart";
import { formatCurrency } from "@/lib/currency";

export default function QuickViewModal() {
  const { quickViewId, closeQuickView } = useUI();
  const products = rawProducts as unknown as Product[];
  const product = products.find(p=>p.id===quickViewId);
  const { add } = useCart();

  const open = Boolean(product);
  // If there's nothing to show, render nothing to avoid stray white panel
  if (!open) return null;
  const p = product as Product;
  return (
    <div className="fixed inset-0 z-50 pointer-events-auto" aria-hidden={false}>
      <div className="absolute inset-0 bg-black/40 transition-opacity opacity-100" onClick={closeQuickView} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden transition-transform scale-100">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">Quick View</h3>
          <button onClick={closeQuickView}><X /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 p-4">
          <div className="relative aspect-square bg-slate-100 rounded overflow-hidden">
            <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
          </div>
          <div>
            <h4 className="text-xl font-semibold">{p.title}</h4>
            <p className="mt-2 text-slate-700 text-sm">{p.description}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-base font-semibold">{formatCurrency(p.price)}</span>
              {p.compareAtPrice && <span className="text-slate-500 line-through">{formatCurrency(p.compareAtPrice)}</span>}
            </div>
            <button onClick={()=>{ add(p.id,1); closeQuickView(); }} className="mt-5 bg-slate-900 text-white px-5 py-2 rounded">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
