# Grays Storefront Rework Plan

This document summarizes the current state of the codebase and outlines a concrete plan to rework it into a clean, scalable storefront in a new GitHub repository.

## Goals
- Modern, fast storefront with clear architecture and typed data layer
- Consistent currency/locale handling (BDT-first, configurable)
- Solid UX: search, filters, cart, quick view, checkout flow
- Good SEO (metadata, OG images, sitemap, robots), a11y, and performance
- CI checks (typecheck, lint, build) and a small test baseline

## Current State Summary
- Framework: Next.js 15 (App Router), React 19, Turbopack for dev/build
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`, global CSS vars
- Data: Static `src/data/products.json` consumed by components
- State: `zustand` stores for cart (`stores/cart.ts`) and UI (`stores/ui.ts`)
- Pages: Home, Shop (client filtering), Product detail (slug), Cart, Checkout, About, Contact, Privacy
- Components: Header with mega menu + mini-cart, ProductGrid/Card, CartDrawer (present but not wired), QuickViewModal, Footer, etc.

## Gaps, Inconsistencies, Opportunities
1. Currency formatting
   - Mix of `formatPrice` (USD) and `formatBDT` (BDT). Standardize via one currency utility and a site-wide config.
2. Data access
   - JSON imported and cast via `as unknown as Product[]` in multiple places. Introduce a typed data access layer (`lib/data/products.ts`) to remove casts and enable future CMS swap.
3. Unused/duplicated UX
   - `CartDrawer` exists but is not wired in layout/header; header uses a mini-cart hover. Decide one cart UX (drawer vs hover) and integrate consistently with `useUI`.
4. SEO
   - Global metadata present; per-page metadata, OpenGraph, and structured data (product JSON-LD) are missing. No `sitemap.ts` or `robots.txt` under `app`.
5. Performance
   - Some `next/image` usages disable optimization (`unoptimized`). Ensure remote patterns cover all domains and remove `unoptimized` where possible. Review hero and LCP.
6. Accessibility
   - Add aria labels and keyboard support across header menus and overlays. Ensure focus management for modals/drawers.
7. CSS hygiene
   - Duplicate `:root` and `body` blocks in `globals.css`. Consolidate tokens and remove duplicates.
8. Testing/CI
   - No tests or CI. Add basic typecheck/lint/build CI and a small Playwright smoke test.
9. Build strategy
   - Turbopack for build is still evolving. Consider standard `next build` for CI stability (keep turbopack for local dev).

## Proposed Architecture (New Repo)
```
src/
  app/
    (storefront)/
      layout.tsx
      page.tsx              # Home
      shop/
        page.tsx            # Server wrapper + client grid
      product/[slug]/
        page.tsx            # Product detail (server + client add-to-cart)
      cart/page.tsx
      checkout/page.tsx
      sitemap.ts
      robots.txt
    api/                    # Future endpoints (e.g., newsletter)
  components/
  data/                     # Dev-only JSON (optional)
  lib/
    data/
      products.ts          # listProducts, getProductBySlug, searchProducts
    currency.ts            # formatCurrency, site currency config
    seo.ts                 # OG builders, JSON-LD helpers
  stores/
  styles/
```

## Migration Plan (Phases)
1) Baseline repo + hygiene
   - Init new repo, copy current code, remove dead code, fix CSS duplicates.
   - Standardize Node version (`.nvmrc` or `.node-version`: 20.x LTS).
   - Decide package manager; add lockfile and CI cache config.

2) Data layer
   - Add `lib/data/products.ts` with typed functions and switch all consumers (Home, ShopClient, Header search, Product detail) to use it.
   - Keep `src/data/products.json` for now; shape validated via `Product` type.

3) Currency/locale unification
   - Add `lib/currency.ts` exposing `formatCurrency(amount, options)` with default `BDT` and locale `bn-BD` or `en-BD`. Replace `formatPrice`/`formatBDT` usages.

4) Cart UX consolidation
   - Choose Drawer as primary cart. Wire `CartDrawer` into layout, add header button to open/close via `useUI`.
   - Keep mini-cart as hover preview or remove to reduce duplication.
   - Extend cart store with derived selectors (subtotal, count) and basic validation.

5) SEO + a11y + perf
   - Add `app/sitemap.ts`, `app/robots.txt`; per-page `generateMetadata` with OG images.
   - Add product JSON-LD on product pages.
   - Ensure keyboard nav for mega menu and modal focus trap.
   - Audit `next/image` (remove `unoptimized` where possible) and set widths/sizes for LCP.

6) Testing + CI
   - Add GitHub Actions: install, typecheck, lint, build.
   - Add Playwright with 1–2 smoke tests (home loads, shop filters, add-to-cart works).

7) Future: CMS/checkout
   - Abstract `lib/data/products` so swapping to CMS (Sanity/Hygraph) is drop-in.
   - Add `/api/checkout` placeholder for future payment integration.

## Concrete Tasks (Tickets)
- Data: Create `lib/data/products.ts` and migrate all imports
- Currency: Create `lib/currency.ts` and replace formatting usages
- Cart: Wire `CartDrawer` into `layout.tsx`; header triggers `useUI.openCart`
- Header: Improve search result thumbnails with `next/image`
- Product: Add JSON-LD schema and proper metadata
- SEO: Implement `app/sitemap.ts` and `app/robots.txt`
- CSS: Consolidate duplicated `:root` and `body` in `globals.css`
- Images: Remove `unoptimized` where remote patterns cover domains
- Testing: Add Playwright with basic flows; add GitHub Actions workflow
- DX: Add `.nvmrc` and `pnpm-lock.yaml` or `package-lock.json`; decide on `next build` vs `--turbopack`

## New Repo Setup (Commands)
```sh
# Create repo locally
mkdir grays-storefront && cd grays-storefront
git init -b main

# Copy current code (or we can scaffold fresh and migrate)
# macOS example if both folders are siblings:
rsync -av --exclude node_modules --exclude .next "../BuyAndSell/" ./

# Choose Node and install deps
echo "20" > .nvmrc
nvm use || nvm install
npm install

# Verify types, lint, build
npm run lint
npm run build
npm run start

# Create GitHub repo and push
git add -A
git commit -m "chore: bootstrap storefront baseline"
gh repo create grays-storefront --private --source=. --push
```

## Acceptance Checklist
- [ ] All pages render without client errors
- [ ] Cart drawer opens/closes, persists across reloads
- [ ] Single currency utility used everywhere
- [ ] Shop filters sync URL and work on reload
- [ ] Product page has JSON-LD and OG metadata
- [ ] Images optimized and LCP passes basic thresholds
- [ ] CI green on typecheck, lint, build
- [ ] Minimal e2e smoke tests passing
