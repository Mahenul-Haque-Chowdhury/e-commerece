"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (productId, qty = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.productId === productId);
        if (idx > -1) items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
        else items.push({ productId, quantity: qty });
        set({ items });
      },
      remove: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQty: (productId, qty) => set({ items: get().items.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i)) }),
      clear: () => set({ items: [] }),
    }),
    { name: "wesell-cart" }
  )
);
