"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, ArrowUpRight, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/stores/currency";
import { useCart } from "@/stores/cart";
import type { Product } from "@/lib/types";

const productHighlights: Record<string, string> = {
  smartphones: "Unlocked + mmWave",
  laptops: "Creator grade",
  tablets: "Flow-ready",
  wearables: "Wellness stack",
  accessories: "Studio ready",
  displays: "Color critical",
};

export default function ProductCard({ product }: { product: Product }) {
  const { currency } = useCurrency();
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<NodeJS.Timeout | null>(null);
  const primary = product.images?.[0] || "/placeholder.svg";
  const secondary = product.images?.[1] || primary;
  const badges = product.badges || [];
  const comparePrice = product.compareAtPrice ? formatCurrency(product.compareAtPrice, currency) : null;

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleAdd = () => {
    add(product.id, 1);
    setJustAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-white/5 via-white/3 to-white/0 p-1 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-[0_35px_90px_-55px_rgba(15,18,40,1)]">
      <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
      <div className="relative flex flex-col gap-4 rounded-[1.3rem] bg-(--background) p-4">
        <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-(--background-alt)">
          <Image
            src={primary}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-700 group-hover:opacity-0"
          />
          <Image
            src={secondary}
            alt={`${product.title} alternate angle`}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 50vw"
            className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
          />
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-(--foreground)">
                  {badge}
                </span>
              ))}
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-[11px] uppercase tracking-wide text-white">
            <ShieldCheck size={14} />
            {productHighlights[product.category] ?? "WeSell verified"}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-soft">{product.brand}</span>
          <h3 className="text-lg font-semibold leading-tight text-balance">
            <Link href={`/product/${product.slug}`} className="hover:underline decoration-dotted">
              {product.title}
            </Link>
          </h3>
          <p className="text-sm text-soft line-clamp-2">{product.description}</p>
        </div>

        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
          <span className="text-xl font-bold tracking-tight text-(--accent)">{formatCurrency(product.price, currency)}</span>
          {comparePrice && <span className="text-sm text-soft line-through">{comparePrice}</span>}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--background) ${
              justAdded
                ? "bg-emerald-500 text-white focus-visible:ring-emerald-300"
                : "bg-(--foreground) text-(--background) hover:bg-(--foreground)/90 focus-visible:ring-(--foreground)"
            }`}
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingBag size={16} />
            {justAdded ? "Added" : "+ Add"}
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold text-soft transition hover:border-white/40 focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--background) w-full sm:w-auto"
          >
            Details <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
