"use client";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listProducts } from "@/lib/data/products";

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "date-desc");
  const all: Product[] = listProducts();
  const minP = Math.min(...all.map(p=>p.price));
  const maxP = Math.max(...all.map(p=>p.price));
  const [minPrice, setMinPrice] = useState(Number(params.get("min") ?? minP));
  const [maxPrice, setMaxPrice] = useState(Number(params.get("max") ?? maxP));

  const filtered = useMemo(() => {
    let list = [...all];
    const term = q.trim().toLowerCase();
    if (term) list = list.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    if (category) list = list.filter(p => p.category === category);
    if (brand) list = list.filter(p => p.brand === brand);
    list = list.filter(p=> p.price >= minPrice && p.price <= maxPrice);
    switch (sort) {
      case "price-asc": list.sort((a,b)=>a.price-b.price); break;
      case "price-desc": list.sort((a,b)=>b.price-a.price); break;
      case "date-asc": list.sort((a,b)=>new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime()); break;
      default: list.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
    }
    return list;
  }, [q, category, brand, sort, all, minPrice, maxPrice]);

  const categories = Array.from(new Set(all.map(p=>p.category)));
  const brands = Array.from(new Set(all.map(p=>p.brand)));

  const updateParams = (next: Record<string,string>) => {
    const u = new URLSearchParams(params.toString());
    for (const [k,v] of Object.entries(next)) {
      if (v) u.set(k, v); else u.delete(k);
    }
    router.push(`/shop?${u.toString()}`);
  };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-6">
        <div>
          <h3 className="font-semibold">Search</h3>
          <input value={q} onChange={(e)=>{ setQ(e.target.value); updateParams({ q: e.target.value }); }} className="mt-2 w-full border px-3 py-2 rounded" placeholder="Search products" />
        </div>
        <div>
          <h3 className="font-semibold">Category</h3>
          <select value={category} onChange={(e)=>{ setCategory(e.target.value); updateParams({ category: e.target.value }); }} className="mt-2 w-full border px-3 py-2 rounded">
            <option value="">All</option>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <h3 className="font-semibold">Brand</h3>
          <select value={brand} onChange={(e)=>{ setBrand(e.target.value); updateParams({ brand: e.target.value }); }} className="mt-2 w-full border px-3 py-2 rounded">
            <option value="">All</option>
            {brands.map(b=> <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <h3 className="font-semibold">Price</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-600">Min</label>
              <input type="number" value={Math.floor(minPrice/100)} min={Math.floor(minP/100)} max={Math.floor(maxPrice/100)} onChange={(e)=>{ const v=Number(e.target.value)*100; setMinPrice(v); updateParams({ min: String(v) }); }} className="mt-1 w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="text-xs text-slate-600">Max</label>
              <input type="number" value={Math.ceil(maxPrice/100)} min={Math.ceil(minPrice/100)} max={Math.ceil(maxP/100)} onChange={(e)=>{ const v=Number(e.target.value)*100; setMaxPrice(v); updateParams({ max: String(v) }); }} className="mt-1 w-full border px-3 py-2 rounded" />
            </div>
          </div>
        </div>
        {/* Price range placeholder for now */}
      </aside>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Shop</h1>
          <select value={sort} onChange={(e)=>{ setSort(e.target.value); updateParams({ sort: e.target.value }); }} className="border px-3 py-2 rounded">
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <ProductGrid products={filtered as Product[]} />
      </section>
    </div>
  );
}
