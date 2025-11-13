"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/stores/cart";
import products from "@/data/products.json";
import { formatCurrency } from "@/lib/currency";
import { useCurrency } from "@/stores/currency";
import { useMemo, useState } from "react";

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

  const [createAccount, setCreateAccount] = useState(true);
  const [submitted, setSubmitted] = useState(false);

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
              Have a coupon? <button type="button" className="text-orange-600 hover:text-orange-500">Click here to enter your code</button>
            </div>
          </div>
          <h1 className="text-xl font-semibold">Billing & Shipping</h1>
          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                clear();
              }}
              className="space-y-4"
            >
              <input required placeholder="Name" className="border border-slate-300 w-full px-3 py-2 rounded" />
              <input required type="tel" placeholder="Phone" className="border border-slate-300 w-full px-3 py-2 rounded" />
              <input type="email" placeholder="Email (optional)" className="border border-slate-300 w-full px-3 py-2 rounded" />
              <input required placeholder="Full address" className="border border-slate-300 w-full px-3 py-2 rounded" />
              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="City" className="border border-slate-300 px-3 py-2 rounded" />
                <input required placeholder="ZIP Code" className="border border-slate-300 px-3 py-2 rounded" />
              </div>

              {/* Create account toggle */}
              <label className="flex items-center gap-2 text-sm select-none">
                <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
                Create an account?
              </label>
              {createAccount && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required placeholder="Username" className="border border-slate-300 px-3 py-2 rounded" />
                  <input required type="password" placeholder="Password" className="border border-slate-300 px-3 py-2 rounded" />
                </div>
              )}

              {/* Payment methods */}
              <div className="mt-2 border rounded-md divide-y">
                <label className="flex items-start gap-3 p-3">
                  <input name="pay" type="radio" defaultChecked />
                  <div>
                    <div className="font-medium">Cash on delivery</div>
                    <div className="text-xs text-slate-500">Pay with cash upon delivery.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3">
                  <input name="pay" type="radio" />
                  <div>
                    <div className="font-medium">Pay Online (Credit/Debit)</div>
                    <div className="text-xs text-slate-500">Card/Mobile banking/Net banking.</div>
                  </div>
                </label>
              </div>

              <button className="mt-3 inline-flex justify-center w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 font-semibold rounded shadow-sm shadow-orange-500/20">
                Place Order
              </button>
            </form>
          ) : (
            <div className="p-4 border rounded bg-slate-50">Thank you! Your mock order has been placed.</div>
          )}
        </section>

        {/* Right: Order summary */}
        <aside className="border rounded-md p-5 bg-white text-black">
          <h2 className="text-lg font-semibold mb-4">Your order</h2>
          <div className="border rounded-md overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto] bg-slate-50 text-xs font-bold uppercase tracking-wide text-black">
              <div className="px-4 py-3 border-b col-span-2">Product</div>
              <div className="px-4 py-3 border-b text-right">Subtotal</div>
            </div>
            {/* Lines */}
            <div className="divide-y">
              {detailed.map(({ item, product }) => (
                <div key={item.productId} className="grid grid-cols-[auto_1fr_auto] items-center text-sm">
                  <div className="px-4 py-3">
                    <div className="relative w-12 h-12 rounded bg-slate-100 overflow-hidden">
                      <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="py-3 pr-4">
                    <div className="font-medium">{product.title}</div>
                    <div className="text-xs opacity-70">× {item.quantity}</div>
                  </div>
                  <div className="px-4 py-3 text-right font-medium">{formatCurrency(product.price * item.quantity, currency)}</div>
                </div>
              ))}
            </div>
            {/* Subtotal row */}
            <div className="grid grid-cols-[auto_1fr_auto]">
              <div className="px-4 py-3 col-span-2 text-sm">Subtotal</div>
              <div className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(subtotal, currency)}</div>
            </div>
            {/* Shipping options */}
            <div className="px-4 py-3 border-t space-y-2">
              <div className="text-sm font-semibold mb-1">Shipping</div>
              {shippingOptions.map((option) => (
                <label key={option.id} className="flex items-start gap-2 text-sm border rounded-md px-3 py-2">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingOption === option.id}
                    onChange={() => setShippingOption(option.id)}
                  />
                  <span className="flex-1">
                    <span className="block font-medium">{option.label}</span>
                    <span className="text-xs text-slate-500">{option.description}</span>
                  </span>
                  <span className="font-medium">{formatCurrency(option.fee, currency)}</span>
                </label>
              ))}
            </div>
            {/* Total */}
            <div className="grid grid-cols-[auto_1fr_auto] border-t bg-slate-50">
              <div className="px-4 py-3 col-span-2 font-semibold">Total</div>
              <div className="px-4 py-3 font-bold text-right">{formatCurrency(total, currency)}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
