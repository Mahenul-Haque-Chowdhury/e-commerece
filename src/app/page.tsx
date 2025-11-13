"use client";
import Link from "next/link";
import Image from "next/image";
// products JSON kept for potential future server usage; using data layer instead.
import { listProducts } from "@/lib/data/products";
import { formatCurrency } from "@/lib/currency";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import { Zap, Truck } from "lucide-react";
import { useCurrency } from "@/stores/currency";

export default function Home() {
  const { currency } = useCurrency();
  const all = listProducts();
  const newest = [...all].sort((a,b)=> new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,8);
  return (
    <div className="bg-(--background) text-(--foreground)">
      {/* Hero */}
      <section className="relative mb-4 md:mb-10">
        <div className="relative h-[63vh] min-h-[432px] w-full overflow-hidden">
          <Image
            src="/hero.jpeg"
            alt="WeSell electronics hero"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Darker overlay for readability */}
          <div className="absolute inset-0 bg-[rgba(15,17,25,0.68)] backdrop-blur-[2px]" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl space-y-6">
                <h1 className="reveal-up text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white tracking-tight">
                  Connected Gear<br className="hidden sm:block" /> For Every City Grid
                </h1>
                <p className="reveal-up reveal-delay-1 text-lg text-white/80 max-w-xl">
                  WeSell curates flagship phones, creator laptops, and smart wearables backed by concierge setup. Built for Los Angeles, New York, and every US city grid your team touches.
                </p>
                <div className="reveal-up reveal-delay-2 mt-8 flex flex-wrap items-center gap-3">
                  <span className="pill px-4 py-2 text-xs font-medium bg-white/10 border border-white/20 text-white flex items-center gap-2">
                    <Zap size={16} className="text-indigo-300" /> Launch code <strong className="text-indigo-200">WESELL5</strong>
                  </span>
                  <span className="pill px-4 py-2 text-xs font-medium bg-white/10 border border-white/20 text-white flex items-center gap-2">
                    <Truck size={16} className="text-indigo-300" /> 2-hour delivery in LA & NYC
                  </span>
                </div>
                <div className="reveal-up reveal-delay-3 mt-10 flex gap-4">
                  <Link href="/shop" className="rounded-md bg-(--accent) px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:bg-indigo-500 transition">
                    Shop electronics
                  </Link>
                  <Link href="/about" className="rounded-md px-7 py-3 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition">
                    Meet the team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="pt-6 pb-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Discover Collections" />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: "Phones", href: "/shop?category=smartphones", img: "https://picsum.photos/seed/phones/1200/900" },
              { label: "Laptops", href: "/shop?category=laptops", img: "https://picsum.photos/seed/laptops/1200/900" },
              { label: "Wearables", href: "/shop?category=wearables", img: "https://picsum.photos/seed/wearables/1200/900" },
              { label: "Accessories", href: "/shop?category=accessories", img: "https://picsum.photos/seed/accessories/1200/900" }
            ].map((c, idx) => (
              <Link key={c.label} href={c.href} className={`group rounded-lg overflow-hidden relative card-base card-hover reveal-card reveal-delay-${(idx % 4) + 1}`}>
                <div className="relative w-full aspect-4/3">
                  <Image src={c.img} alt={c.label} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover group-hover:scale-[1.03] transition-transform" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="pill bg-white/90 text-(--foreground) px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm">{c.label}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Metro delivery", desc: "2-hour dispatch in LA & NYC" },
              { title: "Certified warranty", desc: "Brand-backed repairs + coverage" },
              { title: "Trade-in ready", desc: "Instant valuations on site or chat" },
              { title: "Live engineers", desc: "Device setup & troubleshooting 7 days" }
            ].map((v, idx) => (
              <div key={v.title} className={`card-base card-hover p-4 flex flex-col gap-1 reveal-card reveal-delay-${(idx % 4) + 1}`}>
                <h3 className="text-sm font-semibold tracking-wide">{v.title}</h3>
                <p className="text-xs text-soft">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <SectionHeading title="New Arrivals" />
        <div className="mt-8">
          <ProductGrid products={newest} />
        </div>
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {newest.slice(0,4).map((p, idx) => (
            <div key={p.id} className={`rounded-lg border-base p-4 flex flex-col gap-2 bg-(--background-alt) reveal-card reveal-delay-${(idx % 4) + 1}`}>
              <div className="text-sm font-medium line-clamp-1">{p.title}</div>
              <div className="text-xs text-soft">{p.category.toUpperCase()}</div>
              <div className="text-sm font-semibold">{formatCurrency(p.price, currency)}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/shop" className="inline-block text-sm font-semibold text-(--accent) hover:underline underline-offset-4 reveal-up">View all products</Link>
        </div>
      </section>
    </div>
  );
}
