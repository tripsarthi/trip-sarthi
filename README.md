# Trip Sarthi — Cab & Taxi Service

Next.js site + admin dashboard, backed by Supabase. Built from the Claude Design handoff bundle.

## Pages
- Public: `/` `/about` `/fleet` `/pricing` `/gallery` `/contact`
- Admin: `/admin` (Supabase email/password auth) — manage enquiries, fleet & rates, routes, testimonials, gallery, contact settings.

## Setup
1. Copy `.env.example` → `.env.local` and fill in the Supabase keys.
2. Run `scripts/schema.sql` once in the Supabase **SQL Editor**.
3. `npm install`
4. `npm run seed` — loads default content into Supabase.
5. `node scripts/create-admin.mjs <email> <password>` — creates the dashboard login.
6. `npm run dev`

The public site falls back to built-in default content if Supabase is unreachable or unseeded, so it never renders empty.

## Deploy (Vercel)
`vercel --prod` with the three env vars from `.env.example` set in the Vercel project.
