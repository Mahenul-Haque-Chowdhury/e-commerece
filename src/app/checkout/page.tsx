"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/stores/cart";
import products from "@/data/products.json";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/stores/currency";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const shippingOptions = [
  {
    id: "express" as const,
    label: "Express air (2-day)",
    description: "Nationwide delivery with signature confirmation.",
    fee: 2500,
  },
  {
    id: "standard" as const,
    label: "Ground shipping (3-5 days)",
    description: "UPS/FedEx ground network across the contiguous U.S.",
    fee: 1500,
  },
];

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();
  const detailed = useMemo(
    () =>
      items.map((i) => ({
        item: i,
        product: (products as typeof products).find((p) => p.id === i.productId)!,
      })),
    [items]
  );
  const subtotal = useMemo(
    () => detailed.reduce((acc, d) => acc + d.product.price * d.item.quantity, 0),
    [detailed]
  );
  const [shippingOption, setShippingOption] = useState<(typeof shippingOptions)[number]["id"]>("express");
  const shipping = useMemo(() => shippingOptions.find((opt) => opt.id === shippingOption)?.fee ?? 0, [shippingOption]);
  const total = subtotal + shipping;

  const [createAccount, setCreateAccount] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const inputClass = "input-surface";
  const cardBrands = ["VISA", "Mastercard", "Amex", "PayPal"];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-wide text-slate-400 mb-6">
        <span className="hover:text-slate-600">Shopping cart</span>
        <span> › </span>
        <span className="text-slate-900 font-medium">Checkout details</span>
        <span> › </span>
        <span>Order complete</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* Left: Billing & shipping */}
        <section className="space-y-5">
          {/* Helper links */}
          <div className="text-sm text-slate-500 space-y-1">
            <div>
              Returning customer? <Link href="/login" className="text-orange-600 hover:text-orange-500">Click here to login</Link>
            </div>
            <div>
              Have a coupon? <button type="button" onClick={() => setShowCoupon((prev) => !prev)} className="text-orange-600 hover:text-orange-500">
                {showCoupon ? "Hide coupon field" : "Click here to enter your code"}
              </button>
            </div>
            {showCoupon && (
              <form
                className="mt-2 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  // Placeholder behavior until backend applies discounts.
                  setCouponCode("");
                }}
              >
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Enter coupon code"
                  className={`${inputClass} flex-1 text-sm`}
                />
                <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  Apply
                </button>
              </form>
            )}
          </div>
          <h1 className="text-xl font-semibold">Billing & Shipping</h1>
          {!submitted ? (
            <form
              id="checkout-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                clear();
                router.push("/checkout/payment");
              }}
              className="space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input required placeholder="Name" className={inputClass} />
                <input required type="tel" placeholder="Phone" className={inputClass} />
              </div>
              <input type="email" placeholder="Email (optional)" className={inputClass} />
              <input required placeholder="Full address" className={inputClass} />
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="City" className={inputClass} />
                <input required placeholder="ZIP Code" className={inputClass} />
              </div>

              {/* Create account toggle */}
              <label className="flex items-center gap-2 text-sm select-none">
                <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
                Create an account?
              </label>
              {createAccount && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required placeholder="Username" className={inputClass} />
                  <input required type="password" placeholder="Password" className={inputClass} />
                </div>
              )}

              {/* Payment methods */}
              <div className="mt-2 border rounded-md">
                <div className="flex flex-wrap items-center gap-3 p-3">
                  <div className="flex-1 min-w-[220px]">
                    <div className="font-medium">Pay Online (Credit/Debit)</div>
                    <div className="text-xs text-slate-500">Card/Mobile banking/Net banking.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cardBrands.map((brand) => (
                      <span key={brand} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-soft">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </form>
          ) : (
            <div className="p-4 border rounded bg-slate-50">Thank you! Your mock order has been placed.</div>
          )}
        </section>

        {/* Right: Order summary */}
        <aside className="rounded-3xl border border-white/10 bg-(--background-alt) p-5 text-(--foreground) space-y-5 shadow-[0_35px_90px_-60px_rgba(15,20,40,0.45)]">
          <h2 className="text-lg font-semibold mb-4">Your order</h2>
          <div className="flex flex-col gap-4">
            <div className="space-y-3">
              {detailed.map(({ item, product }) => (
                <div key={item.productId} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                    <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-(--foreground)">{product.title}</p>
                    <p className="text-xs text-soft">× {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-(--foreground)">{formatCurrency(product.price * item.quantity, currency)}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-(--foreground)">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-soft">Shipping</p>
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className={`flex items-start gap-2 rounded-2xl border px-3 py-2 ${shippingOption === option.id ? "border-(--accent)/40 bg-(--accent)/5" : "border-white/10"}`}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingOption === option.id}
                        onChange={() => setShippingOption(option.id)}
                        className="mt-1"
                      />
                      <span className="flex-1 text-xs">
                        <span className="block text-sm font-semibold text-(--foreground)">{option.label}</span>
                        <span className="text-soft">{option.description}</span>
                      </span>
                      <span className="text-sm font-semibold text-(--foreground)">{formatCurrency(option.fee, currency)}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={submitted}
            className={`w-full rounded bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600`}
          >
            {submitted ? "Order placed" : "Place Order"}
          </button>
        </aside>
      </div>
    </div>
  );
}
