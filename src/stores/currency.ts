"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode } from "@/lib/currency";

export type CurrencyState = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
};

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "wesell-currency",
    }
  )
);
