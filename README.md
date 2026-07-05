# Meridian — Local Presence Studio

A Progressive Web App marketing platform for local nonprofits, community
organizations, and small businesses. Deliverables: branded design, a content
calendar, and legitimate Instagram insights via Meta's official Graph API
(read-only). **No bots, no follow/unfollow automation, no posting on a client's
behalf without their review.**

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind v4.
Deploys to Vercel; data/auth (from Phase 2) via Supabase.

## Status

| Phase | Scope | State |
| ----- | ----- | ----- |
| **1** | Marketing site, installable PWA, booking flow | ✅ Built |
| **2** | Auth-gated client dashboard (Supabase) | ✅ Built — runs in demo mode until Supabase keys added |
| **3** | Instagram metrics via Graph API OAuth | ✅ Built — needs Meta app + App Review for live data |
| **4** | Stripe billing | ✅ Built — needs Stripe keys for live payments |

> **Demo mode:** with no credentials in `.env`, the whole app runs on bundled
> sample data. Visit `/login` and choose **Enter as owner** or **Enter as team
> member** to explore the dashboard. Add real keys (see `.env.example`) to switch
> each integration live — no code changes required.

### Going live — what you provide

- **Supabase** (Phase 2): create a project, run `supabase/migrations/0001_init.sql`,
  and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`. This switches auth + data off demo mode.
- **Meta** (Phase 3): create a Meta app with the Instagram Graph API, complete
  App Review / Business Verification (Meta-controlled, multi-week), set
  `META_APP_ID` + `META_APP_SECRET`. Data is read-only and tracked from connect
  date onward.
- **Stripe** (Phase 4): set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`, and
  point a webhook at `/api/stripe/webhook` (`checkout.session.completed`).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (Turbopack)
npm run lint
npm run icons      # regenerate app icons from public/icon.svg
```

## What's in Phase 1

- **Landing page** — positioned around professional organizational presence
  (not "growth hacks"): hero, positioning, services, process, work preview,
  value props, FAQ, and a call-to-action.
- **Work / portfolio** (`/work`) — placeholder case studies (clearly labeled).
- **Booking flow** (`/contact`) — a branded intro-call request form posting to
  `POST /api/contact`.
- **PWA** — installable web app manifest, a custom service worker
  (`public/sw.js`) with offline caching of visited pages and an offline
  fallback, and full icon set. Mobile-first.

### Booking submissions

Phase 1 keeps delivery dependency-free: submissions are logged and best-effort
appended to `.data/intro-requests.jsonl` (gitignored, local dev only). At deploy
time, wire the `deliver()` function in `src/app/api/contact/route.ts` to email
(e.g. Resend), a CRM, or a Supabase table.

## Configuration

- Brand strings, nav, and contact email live in `src/lib/site.ts` — "Meridian"
  is a **placeholder** name.
- Set `NEXT_PUBLIC_SITE_URL` in production for correct canonical/OG URLs.

## Notes for contributors

This is Next.js **16** with Turbopack — some APIs differ from older versions.
See `CLAUDE.md` and the bundled docs in `node_modules/next/dist/docs/` before
adding framework features. The PWA is intentionally hand-rolled rather than
using Serwist/next-pwa (which require webpack).
