"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useCart } from "@/stores/cart";
import { formatCurrency, supportedCurrencies } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";
import { listProducts, searchProducts } from "@/lib/data/products";
import AccountModal from "./AccountModal";
import { useCurrency } from "@/stores/currency";
import type { CartItem, Product } from "@/lib/types";

type MegaMenuItem = { label: string; href: string; description?: string };
type MegaMenuColumn = { heading: string; items: MegaMenuItem[] };
type MegaMenuConfig = {
  title: string;
  description: string;
  sideCategories: MegaMenuItem[];
  columns: MegaMenuColumn[];
};

const megaData = {
  phones: {
    title: "Mobile Phone",
    description: "Flagships, foldables, and essentials built for every budget.",
    sideCategories: [
      { label: "Android flagships", href: "/shop?category=smartphones&platform=android", description: "Latest Snapdragon + AI" },
      { label: "iOS & ecosystem", href: "/shop?category=smartphones&platform=ios", description: "Pair with iPad & Watch" },
      { label: "Foldables", href: "/shop?category=smartphones&style=foldable", description: "Pocket tablets" },
      { label: "Battery champs", href: "/shop?category=smartphones&style=battery", description: "48hr endurance" }
    ],
    columns: [
      {
        heading: "Shop by usage",
        items: [
          { label: "Creators & camera pros", href: "/shop?category=smartphones&use=camera" },
          { label: "Gaming performance", href: "/shop?category=smartphones&use=gaming" },
          { label: "Business ready", href: "/shop?category=smartphones&use=business" },
        ],
      },
      {
        heading: "Upgrade tools",
        items: [
          { label: "Compare models", href: "/shop?category=smartphones&tool=compare" },
          { label: "Trade-in & upgrade", href: "/contact?sell=true" },
          { label: "Student bundles", href: "/shop?category=smartphones&bundle=student" },
        ],
      },
      {
        heading: "Must-have addons",
        items: [
          { label: "Fast chargers", href: "/shop?category=accessories&tag=charger" },
          { label: "Pro cases", href: "/shop?category=accessories&tag=case" },
          { label: "Wireless audio", href: "/shop?category=accessories&tag=audio" },
        ],
      },
    ],
  },
  laptops: {
    title: "Laptops",
    description: "Ultra-portable, gaming rigs, and creator workstations.",
    sideCategories: [
      { label: "Ultrabooks", href: "/shop?category=laptops&type=ultrabook", description: "1kg featherweights" },
      { label: "Gaming rigs", href: "/shop?category=laptops&type=gaming", description: "240Hz graphics" },
      { label: "2-in-1 convertibles", href: "/shop?category=laptops&type=convertible", description: "Pen-ready" },
      { label: "Business & pro", href: "/shop?category=laptops&type=business", description: "Enterprise security" }
    ],
    columns: [
      {
        heading: "Shop by chip",
        items: [
          { label: "Apple silicon", href: "/shop?category=laptops&chip=apple" },
          { label: "Intel Core Ultra", href: "/shop?category=laptops&chip=intel" },
          { label: "AMD Ryzen AI", href: "/shop?category=laptops&chip=amd" },
        ],
      },
      {
        heading: "Best for",
        items: [
          { label: "Developers", href: "/shop?category=laptops&use=dev" },
          { label: "Design & render", href: "/shop?category=laptops&use=design" },
          { label: "Students", href: "/shop?category=laptops&use=student" },
        ],
      },
      {
        heading: "Services",
        items: [
          { label: "Device protection", href: "/contact?topic=protection" },
          { label: "Fleet deployment", href: "/contact?topic=fleet" },
          { label: "Financing", href: "/contact?topic=financing" },
        ],
      },
    ],
  },
  wearables: {
    title: "Smart Watches",
    description: "Track health, coach workouts, and stay connected hands-free.",
    sideCategories: [
      { label: "Performance training", href: "/shop?category=wearables&type=performance", description: "VO2 max, dual-band GPS" },
      { label: "Wellness & daily", href: "/shop?category=wearables&type=wellness", description: "Stress, sleep, mindfulness" },
      { label: "Luxury finishes", href: "/shop?category=wearables&type=luxury", description: "Sapphire, titanium" },
      { label: "Kids & family", href: "/shop?category=wearables&type=family", description: "Safe contacts" }
    ],
    columns: [
      {
        heading: "Shop by goal",
        items: [
          { label: "Running coach", href: "/shop?category=wearables&goal=running" },
          { label: "Strength & HIIT", href: "/shop?category=wearables&goal=hiit" },
          { label: "Health insights", href: "/shop?category=wearables&goal=health" },
        ],
      },
      {
        heading: "Bands & styles",
        items: [
          { label: "Metal & leather", href: "/shop?category=wearables&band=metal" },
          { label: "Performance silicone", href: "/shop?category=wearables&band=sport" },
          { label: "Designer collabs", href: "/shop?category=wearables&band=designer" },
        ],
      },
      {
        heading: "Ecosystem",
        items: [
          { label: "Pair with phones", href: "/shop?category=smartphones" },
          { label: "Audio & wearables", href: "/shop?category=accessories&tag=audio" },
          { label: "Smart home control", href: "/shop?category=accessories&tag=smart-home" },
        ],
      },
    ],
  },
  accessories: {
    title: "Accessories",
    description: "Charge faster, protect better, and level up every device.",
    sideCategories: [
      { label: "Chargers & power", href: "/shop?category=accessories&tag=power", description: "GaN bricks, travel kits" },
      { label: "Audio", href: "/shop?category=accessories&tag=audio", description: "ANC earbuds, studio cans" },
      { label: "Smart home", href: "/shop?category=accessories&tag=smart-home", description: "Lights, locks, sensors" },
      { label: "Protection", href: "/shop?category=accessories&tag=cases", description: "Impact-proof" }
    ],
    columns: [
      {
        heading: "Work better",
        items: [
          { label: "Docking stations", href: "/shop?category=accessories&tag=dock" },
          { label: "Monitors", href: "/shop?category=accessories&tag=monitor" },
          { label: "Keyboards & mice", href: "/shop?category=accessories&tag=input" },
        ],
      },
      {
        heading: "Protect & travel",
        items: [
          { label: "Backpacks", href: "/shop?category=accessories&tag=bag" },
          { label: "Sleeves & folios", href: "/shop?category=accessories&tag=sleeve" },
          { label: "Screen care", href: "/shop?category=accessories&tag=screen" },
        ],
      },
      {
        heading: "Play more",
        items: [
          { label: "VR & AR", href: "/shop?category=accessories&tag=vr" },
          { label: "Console gear", href: "/shop?category=accessories&tag=console" },
          { label: "Streaming kits", href: "/shop?category=accessories&tag=creator" },
        ],
      },
    ],
  },
  clearance: {
    title: "Clearance",
    description: "Last-call tech, refurbished picks, and bundle steals.",
    sideCategories: [
      { label: "Open-box elite", href: "/shop?category=clearance&type=open-box", description: "Verified + warranty" },
      { label: "Refurbished flagship", href: "/shop?category=clearance&type=refurb", description: "Certified grade A" },
      { label: "Bundle & save", href: "/shop?category=clearance&type=bundle", description: "Laptop + monitor" },
      { label: "Under $300", href: "/shop?category=clearance&price=under-300", description: "Budget heroes" }
    ],
    columns: [
      {
        heading: "Deals",
        items: [
          { label: "Daily drops", href: "/shop?category=clearance&sort=date-desc" },
          { label: "Accessory vault", href: "/shop?category=accessories&tag=deal" },
          { label: "Outlet laptops", href: "/shop?category=laptops&type=outlet" },
        ],
      },
      {
        heading: "Programs",
        items: [
          { label: "Subscribe & save", href: "/contact?topic=subscribe" },
          { label: "Device recycling", href: "/contact?sell=true" },
          { label: "Warranty add-ons", href: "/contact?topic=warranty" },
        ],
      },
      {
        heading: "Top picks",
        items: [
          { label: "Certified phones", href: "/shop?category=smartphones&type=certified" },
          { label: "Verified laptops", href: "/shop?category=laptops&type=certified" },
          { label: "Wearable bundles", href: "/shop?category=wearables&type=bundle" },
        ],
      },
    ],
  },
} satisfies Record<string, MegaMenuConfig>;

type MegaKey = keyof typeof megaData;

type NavItem = {
  key: string;
  label: string;
  href: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { key: "phones", label: "Mobile Phone", href: "/shop?category=smartphones" },
  { key: "laptops", label: "Laptops", href: "/shop?category=laptops" },
  { key: "wearables", label: "Smart Watches", href: "/shop?category=wearables" },
  { key: "accessories", label: "Accessories", href: "/shop?category=accessories" },
  { key: "clearance", label: "Clearance", href: "/shop?category=clearance", badge: "Save" },
  { key: "sell", label: "Sell", href: "/contact?sell=true" },
  { key: "contact", label: "Contact us", href: "/contact" },
];

const hasDropdown = (key: string): key is MegaKey => key in megaData;
type DetailedEntry = { item: CartItem; product: Product };

const EMPTY_CART: CartItem[] = [];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [openMega, setOpenMega] = useState<MegaKey | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const cartItems = useCart((state) => state.items) ?? EMPTY_CART;
  const count = cartItems.reduce((a,b)=>a+b.quantity,0);
  const { currency, setCurrency } = useCurrency();
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const cartHoverTimer = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (!cartPreviewOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (!cartRef.current) return;
      if (!cartRef.current.contains(event.target as Node)) {
        setCartPreviewOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [cartPreviewOpen]);

  const openCartPreview = () => {
    if (cartHoverTimer.current) clearTimeout(cartHoverTimer.current);
    setCartPreviewOpen(true);
  };

  const closeCartPreview = () => {
    if (cartHoverTimer.current) clearTimeout(cartHoverTimer.current);
    cartHoverTimer.current = setTimeout(() => setCartPreviewOpen(false), 120);
  };


  const startOpen = (key: MegaKey) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenMega(key);
  };
  const startClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenMega(null), 120);
  };
  const closeMegaImmediate = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenMega(null);
  };
  const handleNavHover = (key: string) => {
    if (hasDropdown(key)) startOpen(key);
    else closeMegaImmediate();
  };

  const all = useMemo(() => listProducts(), []);
  const detailed = useMemo(() =>
    cartItems
      .map((item) => {
        const product = all.find((p) => p.id === item.productId);
        if (!product) return null;
        return { item, product };
      })
      .filter((entry): entry is DetailedEntry => entry !== null),
  [cartItems, all]);
  const subtotal = useMemo(() => detailed.reduce((acc, d)=> acc + d.product.price * d.item.quantity, 0), [detailed]);
  const activeMega = openMega ? megaData[openMega] : null;

  return (
    <>
      <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled
          ? "bg-(--background-alt)/70 backdrop-blur-md border-b border-(--border) shadow-sm"
          : "bg-transparent"
      }`}
    >
      {/* Announcement bar */}
      <div className="hidden md:flex items-center justify-center text-center text-[11px] bg-(--background-alt) text-soft h-7 px-3 border-b border-(--border)">
        <span className="flex items-center gap-2"><span className="pill bg-(--accent) text-white px-2 py-0.5 text-[10px] font-semibold">NEW</span> Fresh redesign live — explore collections</span>
      </div>
      {/* Main row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 text-white" aria-label="Open menu" onClick={() => setMobileOpen(v => !v)}>
            <Menu size={22} />
          </button>
          <Link href="/" className="flex flex-col leading-tight text-white">
            <span className="text-2xl font-black tracking-tight">WeSell</span>
            <span className="text-[10px] uppercase tracking-[0.5em] text-soft">Electronics</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md relative items-center">
          <input
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder="Search..." 
            className="w-full h-10 bg-(--background-alt) border border-(--border) rounded-md px-4 text-sm text-(--foreground) placeholder:text-soft focus:outline-none focus:ring-2 focus:ring-(--accent)"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Search size={20} className="text-soft" />
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

        <div className="flex items-center gap-2 text-(--foreground)">
          <label className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white focus-within:ring-2 focus-within:ring-white/60">
            <span className="sr-only">Currency</span>
            <select
              className="bg-transparent text-white text-xs font-semibold uppercase tracking-wide appearance-none pr-5 focus:outline-none"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            >
              {supportedCurrencies.map((code) => (
                <option key={code} value={code} className="text-black">
                  {code}
                </option>
              ))}
            </select>
          </label>
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
          <span className="hidden sm:inline text-xs text-soft">{subtotal > 0 ? formatCurrency(subtotal, currency) : ""}</span>
          <div
            className="relative"
            ref={cartRef}
            onMouseEnter={openCartPreview}
            onMouseLeave={closeCartPreview}
          >
            <Link
              href="/cart"
              className="relative inline-flex p-2"
              aria-label="Cart"
              onClick={() => setCartPreviewOpen(false)}
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-orange-500 text-white rounded-full px-1.5 py-0.5 leading-none">{count}</span>
              )}
            </Link>
            {cartPreviewOpen && (
              <div
                className="absolute right-0 mt-3 w-72 rounded-2xl border border-(--border) bg-white text-slate-900 shadow-xl ring-1 ring-black/5 z-50"
                onMouseEnter={openCartPreview}
                onMouseLeave={closeCartPreview}
              >
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Cart preview</p>
                  {detailed.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-600">Your bag is empty.</p>
                  ) : (
                    <>
                      <ul className="mt-3 space-y-3 max-h-64 overflow-y-auto">
                        {detailed.slice(0, 3).map(({ item, product }) => (
                          <li key={item.productId} className="flex gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-slate-100">
                              <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.title} fill className="object-cover" sizes="48px" />
                            </div>
                            <div className="flex-1 text-sm">
                              <p className="font-medium text-slate-800 line-clamp-1">{product.title}</p>
                              <p className="text-xs text-slate-500">× {item.quantity}</p>
                              <p className="text-xs font-semibold text-slate-700">{formatCurrency(product.price * item.quantity, currency)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {detailed.length > 3 && (
                        <p className="mt-2 text-[11px] text-slate-500">+{detailed.length - 3} more item(s)</p>
                      )}
                      <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal, currency)}</span>
                      </div>
                    </>
                  )}
                  <Link
                    href="/checkout"
                    className={`mt-4 block rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide ${
                      detailed.length === 0 ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 text-white"
                    }`}
                    aria-disabled={detailed.length === 0}
                    onClick={(event) => {
                      if (detailed.length === 0) {
                        event.preventDefault();
                        return;
                      }
                      setCartPreviewOpen(false);
                    }}
                  >
                    Checkout
                  </Link>
                  <p className="mt-2 text-[11px] text-slate-500">Click the bag icon to view your full cart.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="hidden md:block border-t border-(--border) bg-(--background)" onMouseLeave={startClose}>
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-6 text-xs tracking-wide text-soft">
            {navItems.map((item) => (
              <div
                key={item.key}
                onMouseEnter={() => handleNavHover(item.key)}
                className="h-full flex items-center gap-2"
              >
                <Link
                  href={item.href}
                  className="hover:text-(--accent) hover:underline underline-offset-4 transition-colors font-medium"
                >
                  {item.label}
                </Link>
                {item.badge && (
                  <span className="rounded-full bg-(--accent)/20 px-2 py-0.5 text-[10px] font-semibold text-(--accent)">{item.badge}</span>
                )}
              </div>
            ))}
          </div>

          {/* Mega panel */}
          <div
            className={`absolute left-0 right-0 top-full z-60 bg-white border-t border-(--border) shadow-lg transition-all duration-200 ${activeMega ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"}`}
            onMouseEnter={() => activeMega && openMega && startOpen(openMega)}
          >
            {activeMega && (
              <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
                  <div className="space-y-4 border-r border-(--border) pr-6">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-soft">{activeMega.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{activeMega.description}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-soft">Side categories</p>
                      <ul className="mt-3 space-y-2">
                        {activeMega.sideCategories.map((cat) => (
                          <li key={cat.label}>
                            <Link href={cat.href} className="flex flex-col rounded-md border border-transparent px-3 py-2 text-xs text-(--foreground) transition hover:border-(--border) hover:bg-slate-50">
                              <span className="font-semibold text-slate-800">{cat.label}</span>
                              {cat.description && <span className="text-[11px] text-slate-500">{cat.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {activeMega.columns.map((col) => (
                      <div key={col.heading} className="space-y-3">
                        <div className="text-xs font-semibold text-soft uppercase tracking-wide">{col.heading}</div>
                        <ul className="space-y-2">
                          {col.items.map((it: MegaMenuItem) => (
                            <li key={it.label}>
                              <Link href={it.href} className="text-xs text-(--foreground) transition hover:text-(--accent)">
                                <div className="font-medium text-slate-800">{it.label}</div>
                                {it.description && <div className="text-[11px] text-slate-500">{it.description}</div>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900">
          <div className="px-4 py-3 grid grid-cols-1 gap-3 text-slate-300 safe-bottom-sm">
            {navItems.map((item) => (
              <div key={item.key}>
                <Link href={item.href} className="flex items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide hover:text-white">
                  {item.label}
                  {item.badge && <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] text-orange-300">{item.badge}</span>}
                </Link>
                {hasDropdown(item.key) && (
                  <ul className="ml-3 border-l border-slate-800 pl-4 text-[12px] text-slate-400 space-y-1">
                    {megaData[item.key].sideCategories.slice(0, 3).map((cat) => (
                      <li key={cat.label}>
                        <Link href={cat.href} className="block py-0.5 hover:text-white">
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      </header>
      {accountOpen && <AccountModal onClose={() => setAccountOpen(false)} />}
    </>
  );
}
