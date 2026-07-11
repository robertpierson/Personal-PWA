@AGENTS.md

# Marquee — Local Presence Studio (PWA)

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
4. **PayPal billing** — done.

**Demo mode is the backbone of local dev:** when Supabase isn't configured the
app runs entirely on `src/lib/demo/data.ts` via a demo cookie set at `/login`.
`src/lib/config.ts` exposes `isSupabaseConfigured` / `isPayPalConfigured` /
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
PayPal (Phase 4). Deploy: Vercel.

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
- `src/components/` — UI. `src/content/brand.config.ts` — brand name + accent
  color, the one place to edit to rebrand. `src/content/site.config.ts` — all
  other copy/nav/pricing strings (`src/lib/site.ts` re-exports a subset for
  back-compat). `src/content/` also holds illustrative case studies.
- `public/icon.svg` is the source mark; `npm run icons` regenerates the PNG/ICO
  set (`scripts/generate-icons.mjs`, uses dev-only sharp + png-to-ico).

## Design system

Dark-premium: warm near-black (`--color-paper`, `#0B0B0C`) + one warm-gold
accent, no blue, no cream, sitewide (marketing site and dashboard share one
theme — there's no light/dark toggle). Tokens live in `globals.css`'s
`@theme` block: `paper`/`panel`/`ink`/`line` (surfaces, text, borders) plus
`forest`/`gold` (both repoint to the single accent — see the comment at the
top of `globals.css` for why two token names survive). `brand.config.ts`'s
`accent` is mirrored onto `<html>` as inline CSS vars in `layout.tsx`, which
is the actual runtime source of truth for the accent color.

Fonts: display = **Clash Display** (`font-serif` utility — self-hosted via
`next/font/local`, files in `src/app/fonts/`), body/UI = **General Sans**
(`font-sans`), eyebrows/labels/stat units = **JetBrains Mono** (`font-mono`,
uppercase, gold). Use the `.eyebrow` label and `Reveal` scroll-in helper for
consistency. Status pills use one 3-bucket system (gold = attention, muted
off-white = done, faint = idle) — see `StatusBadge` in
`components/dashboard/primitives.tsx` — never introduce a fourth color.

## Commands

`npm run dev` · `npm run build` · `npm run lint` · `npm run icons`
