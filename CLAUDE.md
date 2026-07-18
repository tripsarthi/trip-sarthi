# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Trip Sarthi** — a cab & taxi service marketing site for the Indian market, plus a full self-service admin CMS. Public visitors browse the fleet, routes, pricing and Himachal trips, then book via WhatsApp/phone or submit an enquiry form. The site owner edits **every** piece of content (text, images, fleet, rates, routes, testimonials, theme colours, homepage section order) from an in-browser admin dashboard and a Shopify-style visual editor — no code deploys needed for content changes.

Built from a Claude Design handoff bundle (see [design-handoff/](design-handoff/)).

## Stack

- **Next.js 15** (App Router) + **React 19**, plain **JavaScript** (no TypeScript)
- **Supabase** — Postgres (content + enquiries), Auth (admin login), Storage (image uploads)
- No CSS framework: a single global stylesheet [app/globals.css](app/globals.css) (~660 lines) with CSS custom properties for theming
- Fonts: `Sora` (display) + `Manrope` (body) via `next/font/google`
- Deployed on **Vercel**

There is **no test suite, linter config, or TypeScript**. Verify changes by running the dev server.

## Commands

```bash
npm run dev            # start dev server (localhost:3000)
npm run build          # production build
npm start              # serve production build
npm run seed           # load default content into Supabase (idempotent-ish)
node scripts/create-admin.mjs <email> <password>   # create/update the admin login
```

## First-time setup

1. Copy `.env.example` → `.env.local`, fill in Supabase keys (+ `NEXT_PUBLIC_SITE_URL` for SEO).
2. Run [scripts/schema.sql](scripts/schema.sql) once in the Supabase **SQL Editor** (creates tables + RLS policies).
3. `npm install` → `npm run seed` → `node scripts/create-admin.mjs <email> <password>` → `npm run dev`.

### Environment variables

| Var | Used by |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public reads, admin auth |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only writes (API routes, scripts) — **never** expose client-side |
| `NEXT_PUBLIC_SITE_URL` | canonical URL for sitemap/robots/OpenGraph |

The hero-image preconnect hostname in [app/layout.js](app/layout.js) is hardcoded to a specific Supabase project — update it if the project changes.

## Architecture & key concepts

### Content flows from Supabase, always with a fallback

The single source of public content is [lib/db.js](lib/db.js) → `getContent()`. It reads every table in parallel via the **anon** client and, per table, **falls back to the defaults** in [lib/defaults.js](lib/defaults.js) if a table is missing/empty/unreachable. This is deliberate: the site renders identically before and after seeding, and never shows an empty page. [lib/defaults.js](lib/defaults.js) mirrors [scripts/seed.mjs](scripts/seed.mjs) — **keep them in sync** when adding content.

`getContent()` returns one big `c` object: `{ settings, t, cars, routes, testimonials, gallery, services, features, steps, values, phone, tel, wa, email, mailto, address }`. `c.t` is the text-block map (see below). Pages destructure `c` and `const t = c.t`.

### Two content models

1. **List tables** (`cars`, `routes`, `testimonials`, `gallery`, `services`, `features`, `steps`, `brand_values`) — ordered rows, each with a `sort` column.
2. **`content` key-value table** — every editable heading/paragraph/label on the site, keyed (e.g. `home_h1`, `about_p1`). Defaults live in `DEFAULT_CONTENT`. DB rows override defaults key-by-key. **Theme settings** (`theme_*`) and the **homepage layout** (`home_layout`, a JSON string) are also stored here as content keys.

### Homepage is layout-driven from the CMS

[app/page.js](app/page.js) defines a `SECTIONS` map (id → render fn). The actual order + visibility + per-section background comes from the `home_layout` content key, parsed by [lib/homeLayout.js](lib/homeLayout.js) (`parseLayout` tolerates bad data and guarantees each known section appears once; `hero` is locked-first-and-always-visible). [lib/homeLayout.js](lib/homeLayout.js) `HOME_SECTIONS` is the single source of truth for section ids/labels/bg-eligibility, shared by the public page and both admin editors.

### Theming via CSS variables

The admin **Appearance** tab writes `theme_*` content keys. `<Shell>` in [components/SiteChrome.js](components/SiteChrome.js) reads them and injects a `<style>` block that overrides `:root` CSS variables (`--brand`, `--btn-radius`, `--card-radius`, `--hero-pad`, etc.). Colours are hex-validated before use. To add a themeable property: add the key to `DEFAULT_CONTENT`, `THEME_KEYS` (in both editors), the editor UI, and `ThemeStyle` in SiteChrome.

### Admin dashboard & visual editor

- **[app/admin/page.js](app/admin/page.js)** (~870 lines, one client component) — the tabbed dashboard: Overview, Enquiries, Appearance (colours + drag-reorder sections + live iframe preview), Website Text, Fleet & Rates, Routes, Page Sections, Testimonials, Himachal Photos, Site Settings. `TableEditor` is a generic grid driven by the `COLUMNS`/`NEW_ROW` maps. Auth state via `supabaseBrowser()`.
- **[app/editor/page.js](app/editor/page.js)** (`/editor`) — full-screen Shopify-style 3-pane visual editor: section navigator · live preview iframe · contextual settings. What each section exposes is declared in [lib/sectionPanels.js](lib/sectionPanels.js) (`SECTION_PANELS`).
- **[components/PreviewBridge.js](components/PreviewBridge.js)** — loaded on the public homepage; **only** active when rendered as `/?admin-preview=1` inside an editor iframe. Lets the admin click a section in the live preview to select it, and highlights the section being edited (via `postMessage`).
- [components/RouteVeil.js](components/RouteVeil.js) / [components/AdminImageField.js](components/AdminImageField.js) suppress the page-transition veil and provide upload UI inside admin/editor/preview.

### API routes (server-only writes)

- **[app/api/admin/route.js](app/api/admin/route.js)** — single POST endpoint for all admin CRUD (`list`/`upsert`/`delete`) across a whitelist of `TABLES`. Auth via `requireUser` ([lib/adminAuth.js](lib/adminAuth.js)) which validates the Supabase session bearer token. Uses the **service-role** client. **Every write calls `purgeSiteCache()`** (`revalidatePath('/', 'layout')`) so edits go live instantly despite ISR.
- **[app/api/admin/upload/route.js](app/api/admin/upload/route.js)** — image upload to the `site-images` Supabase Storage bucket (JPG/PNG/WebP, max 5 MB), returns a public URL.
- **[app/api/enquiries/route.js](app/api/enquiries/route.js)** — public (unauthenticated) POST to save a booking enquiry; inputs are length-clamped. Only name + phone are required.

### Caching

Public pages use `export const revalidate = 3600` (ISR, 1 hour). Because every admin write purges the cache, edits appear immediately anyway. Don't remove the purge call when adding new admin writes.

### Security / RLS

RLS is enabled on all tables: public can **read** content tables (SELECT policies), nobody can write except the service role. `enquiries` is **write-only** for the public (no read policy) — only the service role reads them via the admin API. Never use the service-role key in client components.

## Conventions

- **Path alias `@/*`** maps to repo root (see [jsconfig.json](jsconfig.json)) — import as `@/lib/db`, `@/components/SiteChrome`.
- **Server Components by default.** Add `'use client'` only for interactivity (forms, admin, editor, PreviewBridge, RouteVeil).
- **Images**: use the [components/Img.js](components/Img.js) wrapper (`next/image` with `fill`, AVIF/WebP, blur-up placeholder) for content images; it returns `null` for empty `src`. Admin-set images may point at any HTTPS host (`remotePatterns` allows `**`).
- Public forms POST to `/api/enquiries`; both the hero `QuoteForm` and the `EstimateForm`/`ContactForm` funnel into the same `enquiries` table (the estimate form folds date/time/car into the `message`).
- Booking CTAs are WhatsApp (`c.wa`) and phone (`c.tel`) links built from `settings` — there is no online payment/checkout.
- Match the existing terse, comment-topped style of each file; keep the single global stylesheet (don't introduce CSS modules or a framework).
- `/gallery` permanently redirects to `/himachal` (see [next.config.mjs](next.config.mjs)).

## Routes

Public: `/` · `/about` · `/fleet` (labelled "Car") · `/pricing` (labelled "Price") · `/himachal` · `/contact`
Admin: `/admin` (login + dashboard) · `/editor` (visual editor, redirects to `/admin` if not signed in)

## When adding content

Adding a new editable **text block**: add the key to `DEFAULT_CONTENT` in [lib/defaults.js](lib/defaults.js), surface it in the admin `TEXT_GROUPS` ([app/admin/page.js](app/admin/page.js)) and/or a `SECTION_PANELS` entry ([lib/sectionPanels.js](lib/sectionPanels.js)), then read `t.your_key` in the page.

Adding a new **list table**: add the SQL + RLS in [scripts/schema.sql](scripts/schema.sql), defaults in [lib/defaults.js](lib/defaults.js), a seed call in [scripts/seed.mjs](scripts/seed.mjs), a fetch in `getContent()` ([lib/db.js](lib/db.js)), the table to the `TABLES` whitelist in the admin API, and `COLUMNS`/`NEW_ROW` entries in [app/admin/page.js](app/admin/page.js).

Adding a new **homepage section**: add it to `HOME_SECTIONS` ([lib/homeLayout.js](lib/homeLayout.js)), a renderer in `SECTIONS` ([app/page.js](app/page.js), with `data-sec`/`data-sec-label` for preview selection), and a `SECTION_PANELS` entry ([lib/sectionPanels.js](lib/sectionPanels.js)).
