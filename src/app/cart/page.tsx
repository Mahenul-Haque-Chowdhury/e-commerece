"use client";
import Image from "next/image";
import Link from "next/link";
import productsRaw from "@/data/products.json";
import type { Product } from "@/lib/types";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";
import { useMemo } from "react";

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const products = productsRaw as unknown as Product[];
  const detailed = useMemo(() => items.map(i => ({ item: i, product: products.find(p => p.id === i.productId)! })), [items, products]);
  const subtotal = useMemo(() => detailed.reduce((acc, d) => acc + d.product.price * d.item.quantity, 0), [detailed]);
  const shippingThreshold = 5000; // $50
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 999;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {detailed.length === 0 ? (
        <div className="rounded-md border p-6 bg-white">
          <p className="text-slate-600">Your cart is empty.</p>
          <Link href="/shop" className="mt-4 inline-block bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded">Go shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Items table */}
          <section className="rounded-md border bg-white">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b text-xs uppercase text-slate-500 tracking-wide">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            <div className="divide-y">
              {detailed.map(({ item, product }) => (
                <div key={item.productId} className="grid grid-cols-12 gap-4 px-4 py-4">
                  <div className="col-span-12 md:col-span-6 flex gap-3">
                    <div className="relative w-20 h-20 rounded bg-slate-100 overflow-hidden">
                      <Image src={product.images?.[0] || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{product.title}</div>
                      <button className="text-xs text-red-500 hover:underline" onClick={() => remove(item.productId)}>Remove</button>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-2 flex items-center md:justify-center text-slate-700">{formatPrice(product.price)}</div>
                  <div className="col-span-4 md:col-span-2 flex items-center justify-center gap-2">
                    <button className="px-2 border rounded" onClick={() => setQty(item.productId, item.quantity - 1)}>-</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button className="px-2 border rounded" onClick={() => setQty(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  <div className="col-span-4 md:col-span-2 flex items-center md:justify-end font-medium">{formatPrice(product.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <button className="text-sm text-slate-500 hover:text-red-600" onClick={clear}>Clear cart</button>
              <Link href="/shop" className="text-sm text-orange-600 hover:text-orange-500">Continue shopping →</Link>
            </div>
          </section>

          {/* Summary */}
          <aside className="rounded-md border p-5 bg-white">
            <h2 className="text-lg font-semibold mb-3">Cart totals</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">Shipping</span><span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              <div className="border-t pt-3 flex justify-between font-semibold text-slate-900"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Link href="/checkout" className="text-center bg-orange-500 hover:bg-orange-400 text-white py-2 rounded">Proceed to checkout</Link>
              <Link href="/shop" className="text-center border rounded py-2 hover:bg-slate-50">Continue shopping</Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
