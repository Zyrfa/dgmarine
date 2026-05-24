# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint check
npm start         # Start production server (after build)
```

## Architecture

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Sanity CMS · Zustand · Fuse.js · next-intl · next-themes · Resend

### Routing
All pages live under `app/[locale]/` for PL/EN/DE i18n routing via `next-intl`. Locale is detected from browser and stored in cookie.

### Key directories
- `app/[locale]/` — page routes (products, visual-search, biological, compare, rfq, about)
- `app/api/rfq/` — server action: receives RFQ form data, sends email via Resend
- `components/ship/` — SVG interactive ship diagram; each zone is `<g data-zone="...">`, click filters products
- `components/products/` — ProductCard, DosageCalculator (client-side formula), CompareButton
- `components/rfq/` — RFQDrawer (side panel), RFQForm (port of delivery, vessel, IMO, email)
- `components/search/` — Fuse.js real-time search over product names + tags + description
- `components/ui/` — ThemeToggle, LanguageSwitch
- `sanity/schemas/` — Sanity data models (product, category, shipZone, certificate)
- `lib/rfq-store.ts` — Zustand store for RFQ cart, persisted to localStorage
- `lib/compare-store.ts` — Zustand store for comparison (max 4 products)
- `lib/dosage.ts` — Dosage calculator formulas
- `messages/` — i18n JSON files (pl.json, en.json, de.json)

### Sanity Product schema (key fields)
`name` (localized) · `slug` · `description` (localized rich text) · `shipZones[]` (enum) · `tags[]` (keywords for search) · `isBiological` (boolean → routes to `/biological/`) · `dosage.baseConc` + `dosage.unit` · `datasheet` (PDF)

### Ship zones
`engine_room` · `cargo_hold` · `deck` · `bilge` · `ballast_tank` · `cooling` · `fuel` · `galley` · `accommodation`

### Dark mode
CSS custom properties + Tailwind `dark:` variants, toggled by next-themes. No flash on load (SSR-safe).

### RFQ flow
1. User adds products to cart (Zustand, persisted in localStorage)
2. Opens RFQDrawer → fills RFQForm (port, vessel name, IMO, email, notes per product)
3. `POST /api/rfq` → Resend sends email to DG Marine + confirmation to customer

### Biological products section
Route `/[locale]/biological/` uses a separate layout with green/organic color palette (CSS custom properties overridden at layout level), different background and iconography.

### Search
Fuse.js index built client-side from all products fetched on startup. Searches `name`, `tags`, `description` — entering "engine" returns products tagged `engine` even if not in the product name.
