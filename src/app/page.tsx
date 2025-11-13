"use client";
import Link from "next/link";
import Image from "next/image";
// products JSON kept for potential future server usage; using data layer instead.
import { listProducts } from "@/lib/data/products";
import { formatCurrency } from "@/lib/currency";
import ProductGrid from "@/components/ProductGrid";
import SectionHeading from "@/components/SectionHeading";
import { Zap, Truck } from "lucide-react";

export default function Home() {
  const all = listProducts();
  const newest = [...all].sort((a,b)=> new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,8);
  return (
    <div className="bg-(--background) text-(--foreground)">
      {/* Hero */}
      <section className="relative mb-12 md:mb-20">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          <Image
            src="/hero.jpeg"
            alt="Grays collection hero"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Darker overlay for readability */}
          <div className="absolute inset-0 bg-[rgba(15,17,25,0.68)] backdrop-blur-[2px]" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white tracking-tight">
                  Crafted Essentials<br className="hidden sm:block" /> For Modern Living
                </h1>
                <p className="mt-6 text-lg text-white/80 max-w-xl">
                  Elevated basics engineered for comfort, form, and everyday performance. Discover collections for men, women, and the lifestyle between.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="pill px-4 py-2 text-xs font-medium bg-white/10 border border-white/20 text-white flex items-center gap-2">
                    <Zap size={16} className="text-indigo-300" /> 5% OFF code <strong className="text-indigo-200">GRAYSNEW</strong>
                  </span>
                  <span className="pill px-4 py-2 text-xs font-medium bg-white/10 border border-white/20 text-white flex items-center gap-2">
                    <Truck size={16} className="text-indigo-300" /> Free delivery over ৳3000
                  </span>
                </div>
                <div className="mt-10 flex gap-4">
                  <Link href="/shop" className="rounded-md bg-(--accent) px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:bg-indigo-500 transition">
                    Browse Collection
                  </Link>
                  <Link href="/about" className="rounded-md px-7 py-3 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 transition">
                    Our Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Discover Collections" />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: "Men", href: "/shop?category=men", img: "https://picsum.photos/seed/men-shirt/1200/900" },
              { label: "Women", href: "/shop?category=women", img: "https://picsum.photos/seed/women-hoodie/1200/900" },
              { label: "Accessories", href: "/shop?category=accessories", img: "https://picsum.photos/seed/leather-tote/1200/900" },
              { label: "Shoes", href: "/shop?category=shoes", img: "https://picsum.photos/seed/sneakers/1200/900" }
            ].map(c => (
              <Link key={c.label} href={c.href} className="group rounded-lg overflow-hidden relative card-base card-hover">
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
              { title: "Free shipping", desc: "On orders over ৳3000" },
              { title: "Easy returns", desc: "30-day flexible window" },
              { title: "Secure checkout", desc: "SSL + tokenization" },
              { title: "7-day support", desc: "We're here to help" }
            ].map(v => (
              <div key={v.title} className="card-base card-hover p-4 flex flex-col gap-1">
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
          {newest.slice(0,4).map(p => (
            <div key={p.id} className="rounded-lg border-base p-4 flex flex-col gap-2 bg-(--background-alt)">
              <div className="text-sm font-medium line-clamp-1">{p.title}</div>
              <div className="text-xs text-soft">{p.category.toUpperCase()}</div>
              <div className="text-sm font-semibold">{formatCurrency(p.price)}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/shop" className="inline-block text-sm font-semibold text-(--accent) hover:underline underline-offset-4">View all products</Link>
        </div>
      </section>
    </div>
  );
}
