import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  ArrowUpRight,
  ShieldCheck,
  RefreshCcw,
  Timer,
  MessageCircle
} from "lucide-react";

const navGroups = [
  {
    title: "Shop",
    items: [
      { label: "Smartphones", href: "/shop?category=smartphones" },
      { label: "Laptops", href: "/shop?category=laptops" },
      { label: "Tablets", href: "/shop?category=tablets" },
      { label: "Wearables", href: "/shop?category=wearables" },
      { label: "Accessories", href: "/shop?category=accessories" }
    ]
  },
  {
    title: "Programs",
    items: [
      { label: "Trade-in & Sell", href: "/contact?sell=true" },
      { label: "Clearance outlet", href: "/shop?category=clearance" },
      { label: "Device protection", href: "/contact?topic=protection" },
      { label: "Business procurement", href: "/contact?topic=fleet" }
    ]
  },
  {
    title: "Company",
    items: [
      { label: "About WeSell", href: "/about" },
      { label: "Press & media", href: "/contact" },
      { label: "Partner with us", href: "/contact" },
      { label: "Privacy center", href: "/privacy" }
    ]
  }
];

const serviceHighlights = [
  {
    label: "2-hr metro delivery",
    description: "Ready-stock dispatch across LA & NYC within 120 minutes.",
    icon: Timer
  },
  {
    label: "Official warranty",
    description: "Brand-authorized coverage plus in-house rapid repairs.",
    icon: ShieldCheck
  },
  {
    label: "Trade-in ready",
    description: "Lock an offer online and hand over in store or at your door.",
    icon: RefreshCcw
  }
];

const doors = [
  { label: "Los Angeles Experience Lab", value: "1200 Sunset Blvd, Los Angeles, CA" },
  { label: "NYC Fulfillment Hub", value: "45-12 Vernon Blvd, Long Island City, NY" }
];

const policyLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/contact" },
  { label: "Accessibility", href: "/contact" },
  { label: "Sustainability", href: "/contact" }
];

const socialLinks = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" }
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 text-slate-100">
      <section className="bg-white text-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Heard enough?</p>
            <div className="mt-2 flex items-baseline gap-4">
              <h2 className="text-3xl font-semibold">Contact us</h2>
              <span className="hidden h-0.5 flex-1 bg-lime-300 md:block" />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Concierge hardware help, trade-in valuations, and deployment planning handled in one thread.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-lime-200"
          >
            Start a brief
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">WeSell</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">City-to-city marketplace for everyday tech</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Curated flagship mobiles, creator laptops, smart wearables, and accessories verified by our hardware team. Seamless trade-ins,
                  financing help, and doorstep setup keep you moving without downtime.
                </p>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                {serviceHighlights.map((highlight) => (
                  <li key={highlight.label} className="flex gap-3">
                    <span className="rounded-full bg-white/10 p-2 text-white">
                      <highlight.icon size={14} />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{highlight.label}</p>
                      <p className="text-xs text-slate-400">{highlight.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{group.title}</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-300">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="transition hover:text-white">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-6 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Talk direct</p>
                <div className="mt-3 space-y-1">
                  <div className="font-semibold text-white">+880 1400-555-222</div>
                  <p className="text-xs text-slate-400">Hotline · WhatsApp · Telegram</p>
                  <div className="font-semibold text-white">support@wesell.com</div>
                  <p className="text-xs text-slate-400">Replies within 12h</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Visit</p>
                <ul className="mt-3 space-y-2">
                  {doors.map((door) => (
                    <li key={door.label}>
                      <p className="font-semibold text-white">{door.label}</p>
                      <p className="text-xs text-slate-400">{door.value}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Newsletter</p>
                <form className="mt-3 flex gap-2" aria-label="Newsletter signup">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 rounded-full border border-white/15 bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-white/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-white/90 px-4 text-xs font-semibold text-slate-900 transition hover:bg-white"
                  >
                    Join
                  </button>
                </form>
                <p className="mt-2 text-xs text-slate-500">Launch notes only. Unsubscribe anytime.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MessageCircle size={14} />
                <span>
                  Need a human? <Link href="/contact" className="underline-offset-2 hover:underline">Schedule a call</Link>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <div>© {year} WeSell Electronics · Built in LA & NYC · Shipping nationwide.</div>
            <div className="flex flex-wrap gap-4">
              {policyLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white hover:text-white"
                >
                  <social.icon size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
