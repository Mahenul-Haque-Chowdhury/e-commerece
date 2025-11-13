"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/stores/cart";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/stores/currency";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { ShieldCheck, Truck, MessageCircle, CreditCard, ArrowUpRight, Sparkles } from "lucide-react";

const supportCards = [
  { icon: ShieldCheck, title: "WeSell Shield", desc: "2-year hardware warranty + concierge claims." },
  { icon: Truck, title: "Nationwide express", desc: "Same-day dispatch from LA & NYC hubs." },
  { icon: CreditCard, title: "Finance & deploy", desc: "0% installments and device fleet rollout." },
];

export default function ProductDetailClient({ product }: { product: Product }) {
  const { add } = useCart();
  const { currency } = useCurrency();
  const [active, setActive] = useState(0);
  const comparePrice = product.compareAtPrice ? formatCurrency(product.compareAtPrice, currency) : null;
  const heroImage = product.images[active] ?? "/placeholder.svg";

  const highlights = [
    "Carrier unlocked + global bands",
    "Battery health & diagnostics included",
    "Verified accessories in-box",
  ];

  return (
    <div className="relative isolate bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_55%)] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-4 reveal-up">
            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-(--background-alt) reveal-card">
              <Image src={heroImage} alt={product.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
                <Sparkles size={14} /> {product.brand} Studio
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 reveal-up reveal-delay-1">
              {product.images.slice(0, 4).map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                    active === idx ? "border-(--accent)" : "border-white/10"
                  }`}
                >
                  <Image src={src} alt={`${product.title} thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-4xl border border-white/10 bg-(--background) p-6 shadow-[0_45px_90px_-60px_rgba(15,18,40,1)] reveal-up reveal-delay-1">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-soft">{product.category}</p>
              <h1 className="text-3xl font-semibold text-balance">{product.title}</h1>
              <p className="text-soft leading-relaxed">{product.description}</p>
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight text-(--accent)">{formatCurrency(product.price, currency)}</span>
                {comparePrice && <span className="text-soft line-through">{comparePrice}</span>}
              </div>
              <p className="mt-1 text-sm text-soft">In stock · Ships within 2 hours in SoCal & NYC.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 reveal-up reveal-delay-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-(--background-alt)/40 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-soft">
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 reveal-up reveal-delay-3">
              <button
                type="button"
                onClick={() => add(product.id, 1)}
                className="flex-1 rounded-2xl bg-(--accent) px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-(--accent)/30"
              >
              + Add
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-soft"
              >
                <MessageCircle size={16} /> Chat with a specialist
              </button>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/5 bg-(--background-alt)/30 p-4 text-sm text-soft reveal-up reveal-delay-4">
              <div className="flex items-center gap-2 font-semibold text-white">
                <ShieldCheck size={18} /> Included in WeSell Shield
              </div>
              <ul className="list-disc space-y-1 pl-4">
                <li>Doorstep diagnostics + setup</li>
                <li>Loaner hardware during repairs</li>
                <li>Live engineer text support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {supportCards.map((card, idx) => (
            <div key={card.title} className={`rounded-3xl border border-white/10 bg-(--background) p-5 reveal-card reveal-delay-${(idx % 3) + 1}`}>
              <card.icon size={20} className="text-(--accent)" />
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide">{card.title}</h3>
              <p className="mt-2 text-sm text-soft">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-(--background) p-6 reveal-card">
            <h4 className="text-base font-semibold">What’s in the box</h4>
            <ul className="mt-3 space-y-2 text-sm text-soft">
              <li>• Device + original packaging</li>
              <li>• 65W GaN fast charger & USB-C cable</li>
              <li>• WeSell microfiber sleeve & setup guide</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-(--background) p-6 reveal-card reveal-delay-1">
            <h4 className="text-base font-semibold">Return & fulfillment</h4>
            <p className="mt-3 text-sm text-soft">
              Free 30-day returns nationwide. Local courier delivery in Los Angeles & New York within two hours, or UPS Next Day for the rest of the U.S.
            </p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-(--accent)">
              Talk to fulfillment <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 z-40 w-[min(640px,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-white/20 bg-(--background) px-5 py-3 shadow-2xl reveal-fade">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="min-w-0 flex-1 truncate font-semibold">{product.title}</div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-(--accent)">{formatCurrency(product.price, currency)}</span>
            <button
              type="button"
              onClick={() => add(product.id, 1)}
              className="rounded-full bg-(--accent) px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
