@AGENTS.md

# Meridian — Local Presence Studio (PWA)

Marketing-services platform for local nonprofits, community orgs, and small
businesses. Deliverables: branded design, a content calendar, and **legitimate**
Instagram growth via Meta's official Graph API (read-only insights only).

> **Hard rule:** never build anything that automates actions on a client's
> social account (posting, following, liking) without a human-reviewed step.
> If a request drifts that way, stop and flag it.

## Build phases — all four built

1. **Marketing site + PWA + booking** — done.
2. **Auth-gated client dashboard** (Supabase) — done. Overview, content
   calendar, designs, deliverables, invoices, insights, settings.
3. **Instagram metrics** via Graph API OAuth (read-only) — done.
4. **Stripe billing** — done.

**Demo mode is the backbone of local dev:** when Supabase isn't configured the
app runs entirely on `src/lib/demo/data.ts` via a demo cookie set at `/login`.
`src/lib/config.ts` exposes `isSupabaseConfigured` / `isStripeConfigured` /
`isMetaConfigured` / `isDemoMode`. Every data-access function in
`src/lib/data/dashboard.ts` branches on `session.demo`. Real integrations are
fully wired and activate when the corresponding env vars are present — no code
changes to go live. See `.env.example`.

Tenancy: **one org per account** (`org_members.user_id` is unique), plus limited
**worker** members. Owners see everything; workers see only Overview, Content
calendar, Insights. Enforced in two places: nav filtering + per-page
`redirect()` guards in the app, and RLS policies in
`supabase/migrations/0001_init.sql` (`current_org_id()` / `is_org_owner()`).
Client-facing writes go through the service role (bypasses RLS) — the operator
seeds data; clients read.

Auth: `src/lib/auth.ts` (`getSession`/`requireSession`), server actions in
`src/app/(auth)/actions.ts` (demo entry + Supabase password auth + sign out),
session refresh in root `middleware.ts` (no-op in demo mode).

Hard rule still holds in Phase 3: Meta scopes are read-only
(`src/lib/meta/graph.ts`) — never post/follow/act on a client account.

## Stack

Next.js 16 (App Router, **Turbopack**) · React 19 · TypeScript · Tailwind v4
(CSS-based `@theme` in `globals.css`, no config file) · Supabase (Phase 2+) ·
Stripe (Phase 4). Deploy: Vercel.

**PWA is hand-rolled, not Serwist/next-pwa** — Serwist's Next plugin needs
webpack, which fights Next 16's default Turbopack. See `public/sw.js` +
`src/app/manifest.ts` + `ServiceWorkerRegister`.

> This is Next.js **16** — read `node_modules/next/dist/docs/` before using an
> API you're unsure about. `params`/`searchParams` are Promises; `themeColor`
> lives in the `viewport` export, not `metadata`.

## Layout

- `src/app/(marketing)/` — public site (own layout with nav + footer): landing,
  `work/`, `contact/`.
- `src/app/api/contact/route.ts` — booking submissions. Phase-1 delivery just
  logs + appends to `.data/intro-requests.jsonl` (gitignored). Wire `deliver()`
  to email/CRM/Supabase at deploy time — that's the only spot to change.
- `src/app/offline/page.tsx` — SW navigation fallback (precached).
- `src/components/` — UI. `src/lib/site.ts` — all brand/nav strings (swap here
  when the real brand is chosen). `src/content/` — placeholder case studies.
- `public/icon.svg` is the source mark; `npm run icons` regenerates the PNG/ICO
  set (`scripts/generate-icons.mjs`, uses dev-only sharp + png-to-ico).

## Design system

Editorial "paper" palette, light-only (intentional, for brand consistency).
Tokens live in `globals.css`: `paper`/`ink`/`forest`/`gold` families. Display
serif = **Fraunces** (`font-serif`), UI/body = **Geist** (`font-sans`). Use the
`.eyebrow` label and `Reveal` scroll-in helper for consistency.

## Commands

`npm run dev` · `npm run build` · `npm run lint` · `npm run icons`

Brand is a **placeholder** ("Meridian") until the user picks a real name.
