"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { formatCurrency } from "@/lib/currency";
import { listProducts, searchProducts } from "@/lib/data/products";
import AccountModal from "./AccountModal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const { openCart } = useUI();
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const { items, remove } = useCart();
  const count = items.reduce((a,b)=>a+b.quantity,0);

  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [] as ReturnType<typeof listProducts>;
    return searchProducts(term).slice(0, 6);
  }, [q]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // expose header height via CSS var for overlays (e.g., search)
  useEffect(() => {
    const el = document.getElementById("site-header");
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      document.documentElement.style.setProperty("--header-h", `${Math.round(rect.height)}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);

  // close mega menu on scroll to keep things tidy
  useEffect(() => {
    const closeOnScroll = () => setOpenMega(null);
    window.addEventListener("scroll", closeOnScroll);
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, []);

  const startOpen = (key: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenMega(key);
  };
  const startClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenMega(null), 120);
  };

  const megaData: Record<string, { title: string; columns: { heading: string; items: { label: string; href: string }[] }[] }> = {
    men: {
      title: "Shop Men",
      columns: [
        {
          heading: "Clothing",
          items: [
            { label: "T-Shirts", href: "/shop?category=men&tag=tshirt" },
            { label: "Shirts", href: "/shop?category=men&tag=shirt" },
            { label: "Hoodies", href: "/shop?category=men&tag=hoodie" },
            { label: "Jackets", href: "/shop?category=men&tag=jackets" },
          ],
        },
        {
          heading: "Bottoms",
          items: [
            { label: "Jeans", href: "/shop?category=men&tag=jeans" },
            { label: "Chinos", href: "/shop?category=men&tag=chinos" },
            { label: "Shorts", href: "/shop?category=men&tag=shorts" },
          ],
        },
        {
          heading: "Accessories",
          items: [
            { label: "Belts", href: "/shop?category=accessories&tag=belts" },
            { label: "Caps & Hats", href: "/shop?category=accessories&tag=hats" },
            { label: "Socks", href: "/shop?category=accessories&tag=socks" },
          ],
        },
      ],
    },
    women: {
      title: "Shop Women",
      columns: [
        {
          heading: "Clothing",
          items: [
            { label: "Tops & Tees", href: "/shop?category=women&tag=tops" },
            { label: "Dresses", href: "/shop?category=women&tag=dresses" },
            { label: "Hoodies", href: "/shop?category=women&tag=hoodie" },
            { label: "Outerwear", href: "/shop?category=women&tag=outerwear" },
          ],
        },
        {
          heading: "Bottoms",
          items: [
            { label: "Jeans", href: "/shop?category=women&tag=jeans" },
            { label: "Skirts", href: "/shop?category=women&tag=skirts" },
            { label: "Leggings", href: "/shop?category=women&tag=leggings" },
          ],
        },
        {
          heading: "Accessories",
          items: [
            { label: "Bags", href: "/shop?category=accessories&tag=bags" },
            { label: "Scarves", href: "/shop?category=accessories&tag=scarves" },
            { label: "Jewelry", href: "/shop?category=accessories&tag=jewelry" },
          ],
        },
      ],
    },
    accessories: {
      title: "Shop Accessories",
      columns: [
        {
          heading: "Essentials",
          items: [
            { label: "Hats", href: "/shop?category=accessories&tag=hats" },
            { label: "Belts", href: "/shop?category=accessories&tag=belts" },
            { label: "Socks", href: "/shop?category=accessories&tag=socks" },
          ],
        },
        {
          heading: "Tech",
          items: [
            { label: "Phone Cases", href: "/shop?category=accessories&tag=phone" },
            { label: "Laptop Sleeves", href: "/shop?category=accessories&tag=laptop" },
          ],
        },
      ],
    },
    shoes: {
      title: "Shop Shoes",
      columns: [
        {
          heading: "Styles",
          items: [
            { label: "Sneakers", href: "/shop?category=shoes&tag=sneakers" },
            { label: "Boots", href: "/shop?category=shoes&tag=boots" },
            { label: "Sandals", href: "/shop?category=shoes&tag=sandals" },
          ],
        },
        {
          heading: "Purpose",
          items: [
            { label: "Casual", href: "/shop?category=shoes&tag=casual" },
            { label: "Running", href: "/shop?category=shoes&tag=running" },
            { label: "Hiking", href: "/shop?category=shoes&tag=hiking" },
          ],
        },
      ],
    },
  };

  const all = useMemo(() => listProducts(), []);
  const detailed = useMemo(() => items.map(i => ({ item: i, product: all.find(p=>p.id===i.productId)! })), [items, all]);
  const subtotal = useMemo(() => detailed.reduce((acc, d)=> acc + d.product.price * d.item.quantity, 0), [detailed]);

  return (
    <>
      <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md shadow-black/30"
          : "bg-slate-950 shadow-md shadow-black/30"
      }`}
    >
      {/* Announcement bar */}
      <div className="hidden md:flex items-center justify-center text-center text-xs bg-slate-950 text-white h-7 px-3">
        <span>Free shipping over $50 — New arrivals out now</span>
      </div>
      {/* Main row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 text-white" aria-label="Open menu" onClick={() => setMobileOpen(v => !v)}>
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/grays-logo.svg" alt="Grays" width={128} height={32} priority />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md relative items-center">
          <input
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder="Search..." 
            className="w-full h-10 bg-slate-800 border border-slate-700 rounded-md px-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Search size={20} className="text-slate-400" />
          </div>
          {q && (
            <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden z-10">
              <div className="max-h-80 overflow-y-auto">
                {results.length === 0 && <div className="p-4 text-slate-600">No results found.</div>}
                <div className="grid md:grid-cols-1">
                  {results.map(p => (
                    <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setQ('')} className="flex gap-3 px-4 py-3 hover:bg-slate-50">
                      <div className="w-14 h-14 bg-slate-100 rounded" />
                      <div>
                        <div className="font-medium text-slate-800">{p.title}</div>
                        <div className="text-xs text-slate-500 uppercase">{p.category}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-white">
          <button
            className="p-2"
            aria-label="Account"
            aria-haspopup="dialog"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen(true)}
          >
            <User size={20} />
          </button>
          {/* Subtotal amount to the left of cart icon */}
          <span className="hidden sm:inline text-sm text-slate-300">{subtotal > 0 ? formatCurrency(subtotal) : ""}</span>
          <div className="relative">
            <button className="relative p-2" aria-label="Cart" onClick={openCart}>
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-orange-500 text-white rounded-full px-1.5 py-0.5 leading-none">{count}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="hidden md:block border-t border-slate-700" onMouseLeave={startClose}>
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-10 flex items-center gap-6 text-sm text-slate-300">
            {[
              { key: "men", label: "Men", href: "/shop?category=men" },
              { key: "women", label: "Women", href: "/shop?category=women" },
              { key: "accessories", label: "Accessories", href: "/shop?category=accessories" },
              { key: "shoes", label: "Shoes", href: "/shop?category=shoes" },
            ].map((l)=> (
              <div
                key={l.key}
                onMouseEnter={() => startOpen(l.key)}
                className="h-full flex items-center"
              >
                <Link href={l.href} className="hover:text-white hover:underline underline-offset-4 transition-colors">{l.label}</Link>
              </div>
            ))}
          </div>

          {/* Mega panel */}
          <div
            className={`absolute left-0 right-0 top-full z-60 bg-white border-t shadow-xl transition-all duration-200 ${openMega ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"}`}
            onMouseEnter={() => openMega && startOpen(openMega)}
          >
            {openMega && (
              <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-3 gap-8">
                <div className="col-span-3">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">{megaData[openMega].title}</h3>
                </div>
                {megaData[openMega].columns.map((col) => (
                  <div key={col.heading} className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">{col.heading}</div>
                    <ul className="mt-1 space-y-1">
                      {col.items.map((it) => (
                        <li key={it.label}>
                          <Link href={it.href} className="text-sm text-slate-600 hover:text-orange-500 transition-colors">{it.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900">
          <div className="px-4 py-3 grid grid-cols-1 gap-1 text-slate-300">
            {[
              { label: "Men", href: "/shop?category=men" },
              { label: "Women", href: "/shop?category=women" },
              { label: "Accessories", href: "/shop?category=accessories" },
              { label: "Shoes", href: "/shop?category=shoes" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="py-2 hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      </header>
      {accountOpen && <AccountModal onClose={() => setAccountOpen(false)} />}
    </>
  );
}
