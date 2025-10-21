"use client";
import Link from "next/link";
import Image from "next/image";
import products from "@/data/products.json";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import { Zap, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-900 text-white">
  {/* Hero with background image kept, plus overlay content */}
  <section className="relative mb-12 md:mb-20">
        <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
          {/* Background image (kept) — brighter, no dark overlay */}
          <Image
            src="/hero.webp"
            alt="Grays hero image"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-center lg:object-[50%_55%]"
          />

          {/* Subtle dark overlay so image feels like a background */}
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />


          {/* Centered content */}
          <div className="absolute inset-0">
            <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-sm sm:text-base text-white/90 italic">Welcome to Grays…</p>
                <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-[0_1px_10px_rgba(0,0,0,0.2)]">ELEVATE YOUR EVERYDAY</h1>

                {/* Promo badges */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-sm">
                    <Zap size={16} className="text-orange-400" />
                    <span>
                      <span className="font-semibold">5% OFF</span> with code: <span className="font-semibold text-orange-300">GRAYSNEW</span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-sm">
                    <Truck size={16} className="text-orange-400" />
                    <span>Free delivery over ৳3000</span>
                  </span>
                </div>

                <div className="mt-7">
                  <Link
                    href="/shop"
                    className="inline-block rounded-md bg-orange-500 px-8 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Shop All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Design */}
      <section className="bg-slate-800 rounded-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <SectionHeading title="Shop by Design" className="[&>h2]:text-white" />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Men", href: "/shop?category=men", img: "https://picsum.photos/seed/men-shirt/1200/900" },
              { label: "Women", href: "/shop?category=women", img: "https://picsum.photos/seed/women-hoodie/1200/900" },
              { label: "Accessories", href: "/shop?category=accessories", img: "https://picsum.photos/seed/leather-tote/1200/900" },
              { label: "Shoes", href: "/shop?category=shoes", img: "https://picsum.photos/seed/sneakers/1200/900" }
            ].map((c) => (
            <Link key={c.label} href={c.href} className="group block rounded-md overflow-hidden ring-1 ring-slate-700 hover:ring-orange-500 transition-all">
              <div className="relative w-full aspect-4/3 bg-slate-700">
                <Image src={c.img} alt={`${c.label} design`} fill sizes="(min-width: 768px) 25vw, 50vw" unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                  <span className="inline-block bg-black/60 px-3 py-1.5 rounded text-white text-sm font-medium tracking-wide uppercase">{c.label}</span>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </section>

      {/* Info strip as a single colored line (orange) */}
      <section className="rounded-none">
        <div className="w-full bg-orange-600">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-sm text-white">
            <div className="flex flex-wrap items-center justify-center gap-y-2">
              <div className="whitespace-nowrap"><span className="font-semibold">Free shipping</span><span className="text-white/90"> on orders over $50</span></div>
              <span className="mx-4 text-white/60 hidden sm:inline">•</span>
              <div className="whitespace-nowrap"><span className="font-semibold">Easy returns</span><span className="text-white/90"> within 30 days</span></div>
              <span className="mx-4 text-white/60 hidden sm:inline">•</span>
              <div className="whitespace-nowrap"><span className="font-semibold">Secure checkout</span><span className="text-white/90"> SSL encrypted</span></div>
              <span className="mx-4 text-white/60 hidden sm:inline">•</span>
              <div className="whitespace-nowrap"><span className="font-semibold">Support</span><span className="text-white/90"> 7 days a week</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeading title="New Arrivals" className="[&>h2]:text-white" />
        <div className="mt-8">
          <ProductGrid products={[...products].sort((a,b)=> new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,8) as unknown as import("@/lib/types").Product[]} />
        </div>
        <div className="mt-6 text-center">
          <Link href="/shop" className="inline-block text-sm font-medium text-orange-600 hover:text-orange-500">View all</Link>
        </div>
      </section>
    </div>
  );
}
