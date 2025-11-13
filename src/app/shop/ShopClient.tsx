"use client";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { listProducts } from "@/lib/data/products";
import { SlidersHorizontal, FilterX, Sparkles } from "lucide-react";

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "");
  const [sort, setSort] = useState(params.get("sort") ?? "date-desc");
  const all: Product[] = listProducts();
  const minP = Math.min(...all.map((p) => p.price));
  const maxP = Math.max(...all.map((p) => p.price));
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

  const categories = Array.from(new Set(all.map((p) => p.category)));
  const brands = Array.from(new Set(all.map((p) => p.brand)));
  const quickFilters = [
    { label: "Flagship phones", category: "smartphones" },
    { label: "Creator laptops", category: "laptops" },
    { label: "Flow tablets", category: "tablets" },
    { label: "Studio accessories", category: "accessories" },
  ];

  const updateParams = (next: Record<string,string>) => {
    const u = new URLSearchParams(params.toString());
    for (const [k,v] of Object.entries(next)) {
      if (v) u.set(k, v); else u.delete(k);
    }
    router.push(`/shop?${u.toString()}`);
  };

  const applyQuickFilter = (payload: { category?: string; brand?: string }) => {
    const nextCategory = payload.category ?? "";
    const nextBrand = payload.brand ?? "";
    setCategory(nextCategory);
    setBrand(nextBrand);
    updateParams({ category: nextCategory, brand: nextBrand });
  };

  const activeFilters = [
    q && { label: `Search: “${q}”`, onClear: () => { setQ(""); updateParams({ q: "" }); } },
    category && { label: category, onClear: () => { setCategory(""); updateParams({ category: "" }); } },
    brand && { label: brand, onClear: () => { setBrand(""); updateParams({ brand: "" }); } },
  ].filter(Boolean) as { label: string; onClear: () => void }[];

  const resetAll = () => {
    setQ("");
    setCategory("");
    setBrand("");
    setSort("date-desc");
    setMinPrice(minP);
    setMaxPrice(maxP);
    router.push("/shop");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-white/10 bg-(--background-alt)/40 p-6 shadow-[0_25px_60px_-35px_rgba(15,20,40,0.45)]">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-soft">
          <SlidersHorizontal size={14} /> Refine results
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-soft">Search</label>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                updateParams({ q: e.target.value });
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-(--background) px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
              placeholder="Try “creator laptop”"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-soft">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                updateParams({ category: e.target.value });
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-(--background) px-4 py-3 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-soft">Brand</label>
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                updateParams({ brand: e.target.value });
              }}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-(--background) px-4 py-3 text-sm"
            >
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-soft">Price range ($)</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="number"
                value={Math.floor(minPrice / 100)}
                min={Math.floor(minP / 100)}
                max={Math.floor(maxPrice / 100)}
                onChange={(e) => {
                  const next = Number(e.target.value) * 100;
                  setMinPrice(next);
                  updateParams({ min: String(next) });
                }}
                className="rounded-2xl border border-white/10 bg-(--background) px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={Math.ceil(maxPrice / 100)}
                min={Math.ceil(minPrice / 100)}
                max={Math.ceil(maxP / 100)}
                onChange={(e) => {
                  const next = Number(e.target.value) * 100;
                  setMaxPrice(next);
                  updateParams({ max: String(next) });
                }}
                className="rounded-2xl border border-white/10 bg-(--background) px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {quickFilters.map((filter) => {
            const active = category === filter.category;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => applyQuickFilter({ category: filter.category })}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  active ? "bg-(--accent) text-white" : "bg-white/5 text-soft hover:bg-white/10"
                }`}
              >
                <Sparkles size={14} /> {filter.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-soft hover:border-white/40"
          >
            <FilterX size={14} /> Reset filters
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {activeFilters.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.onClear}
                className="rounded-full border border-white/20 px-3 py-1 text-soft hover:border-white/50"
              >
                {chip.label} ✕
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-soft">{filtered.length} devices curated</p>
            <h1 className="text-3xl font-semibold">Shop the catalog</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-soft">Sort by</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                updateParams({ sort: e.target.value });
              }}
              className="rounded-2xl border border-white/10 bg-(--background) px-3 py-2"
            >
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-soft">
            No products match those filters yet—try resetting or switching categories.
          </div>
        ) : (
          <ProductGrid products={filtered as Product[]} />
        )}
      </section>
    </div>
  );
}
