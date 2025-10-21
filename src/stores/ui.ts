"use client";
import { create } from "zustand";

type UIState = {
  cartOpen: boolean;
  quickViewId?: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  cartOpen: false,
  quickViewId: null,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set({ cartOpen: !get().cartOpen }),
  openQuickView: (id) => set({ quickViewId: id }),
  closeQuickView: () => set({ quickViewId: null }),
}));
