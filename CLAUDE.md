@AGENTS.md

# Meridian — Local Presence Studio (PWA)

Marketing-services platform for local nonprofits, community orgs, and small
businesses. Deliverables: branded design, a content calendar, and **legitimate**
Instagram growth via Meta's official Graph API (read-only insights only).

> **Hard rule:** never build anything that automates actions on a client's
> social account (posting, following, liking) without a human-reviewed step.
> If a request drifts that way, stop and flag it.

## Build phases (strictly in order; review gate between each)

1. **Marketing site + PWA + booking** ← **current, complete for review**
2. Auth-gated client dashboard (Supabase) — content calendar, deliverables
3. Instagram metrics via Graph API OAuth (read-only)
4. Stripe billing

Tenancy (Phase 2): **one org per account**, plus limited **worker/viewer**
sub-accounts (role enum on org members). Model roles as first-class from the
start. The operator gets an admin view across all orgs.

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
