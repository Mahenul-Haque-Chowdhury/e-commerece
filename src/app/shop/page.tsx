import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Suspense fallback={<div>Loading…</div>}>
        <ShopClient />
      </Suspense>
    </div>
  );
}
