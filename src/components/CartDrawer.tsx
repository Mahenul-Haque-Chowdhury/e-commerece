"use client";
import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import rawProducts from "@/data/products.json";
import type { Product } from "@/lib/types";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { formatCurrency } from "@/lib/currency";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/stores/currency";

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { items, setQty, remove } = useCart();
  const { currency } = useCurrency();
  const products = rawProducts as unknown as Product[];
  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((product) => map.set(product.id, product));
    return map;
  }, [products]);

  const missingProductIds = items.filter((item) => !productMap.has(item.productId)).map((item) => item.productId);
  useEffect(() => {
    if (!missingProductIds.length) return;
    missingProductIds.forEach((id) => remove(id));
  }, [missingProductIds, remove]);

  const detailed = items.reduce<{ item: (typeof items)[number]; product: Product }[]>((acc, item) => {
    const product = productMap.get(item.productId);
    if (!product) return acc;
    acc.push({ item, product });
    return acc;
  }, []);
  const subtotal = detailed.reduce((acc, d) => acc + d.product.price * d.item.quantity, 0);

  return (
  <div className={`fixed inset-0 z-50 ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${cartOpen ? "opacity-100" : "opacity-0"}`} onClick={closeCart} />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Your Cart</h3>
          <button aria-label="Close cart" onClick={closeCart}><X /></button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-160px)]">
          {detailed.length === 0 && <p className="text-slate-600">Your cart is empty.</p>}
          {detailed.map(({ item, product }) => (
            <div key={item.productId} className="flex gap-3 border rounded p-2">
              <div className="relative w-20 h-20 bg-slate-100 rounded overflow-hidden">
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-slate-600">{formatCurrency(product.price, currency)}</p>
                  </div>
                  <button className="text-sm text-slate-500" onClick={() => remove(item.productId)}>Remove</button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button className="px-2 border" onClick={() => setQty(item.productId, item.quantity - 1)}>-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button className="px-2 border" onClick={() => setQty(item.productId, item.quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t safe-bottom-sm">
          <div className="flex justify-between font-medium">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>
          <Link href="/checkout" onClick={closeCart} className="mt-3 block text-center bg-sky-600 text-white py-2 rounded">Checkout</Link>
        </div>
      </aside>
    </div>
  );
}
