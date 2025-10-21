"use client";
import { useEffect, FormEvent, MouseEvent as ReactMouseEvent } from "react";
import { X } from "lucide-react";

type AccountModalProps = {
  onClose: () => void;
};

export default function AccountModal({ onClose }: AccountModalProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Placeholder: authentication will be wired later on.
  };

  const onOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4"
  role="dialog"
  aria-modal="true"
      onClick={onOverlayClick}
    >
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-2xl">
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-900"
          aria-label="Close account modal"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <div className="grid gap-0 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
          <section className="p-8">
            <h2 className="text-xl font-semibold tracking-tight">Login</h2>
            <p className="mt-2 text-sm text-slate-500">Welcome back. Sign in to access your account and orders.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-600">
                Username or email address
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Password
                <input
                  type="password"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="••••••••"
                />
              </label>
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                  Remember me
                </label>
                <button type="button" className="text-orange-600 hover:text-orange-500">
                  Lost your password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Log In
              </button>
            </form>
          </section>
          <section className="p-8 bg-slate-50">
            <h2 className="text-xl font-semibold tracking-tight">Register</h2>
            <p className="mt-2 text-sm text-slate-500">Create an account to speed up checkout and keep track of your orders.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-600">
                Username
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Choose a username"
                />
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Email address
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Password
                <input
                  type="password"
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Create a password"
                />
              </label>
              <p className="text-xs text-slate-500">
                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.
              </p>
              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Register
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
