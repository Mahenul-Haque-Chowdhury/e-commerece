"use client";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function PaymentGatewayPlaceholder() {
  return (
    <div className="min-h-[70vh] bg-(--background) text-(--foreground) px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-(--background-alt) p-10 text-center shadow-[0_25px_80px_-45px_rgba(15,15,40,1)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
          <ShieldCheck size={32} />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Secure payment gateway</h1>
        <p className="mt-3 text-sm text-soft">
          You are being redirected to our banking partner to authorize the payment. This mock screen stands in for the actual processor; close this tab or return back once you are done testing.
        </p>
        <div className="mt-8 grid gap-4 text-left text-sm">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <p className="font-semibold">3D Secure verification</p>
              <p className="text-soft text-xs">All cards route through OTP/biometric confirmation to keep accounts safe.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div>
              <p className="font-semibold">PCI-compliant handling</p>
              <p className="text-soft text-xs">No card details touch WeSell servers—everything flows through the provider.</p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-soft hover:border-white/60">
            <ArrowLeft size={16} /> Back to store
          </Link>
          <Link href="/checkout" className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-5 py-2 text-sm font-semibold text-white">
            Return to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
