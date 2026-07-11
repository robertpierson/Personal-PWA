# Going live — setup guide

The app runs fully in **demo mode** with zero setup. This guide turns each
integration on for real. Do them in order; each is independent, so you can stop
after Supabase and still have a working, sign-in-able product.

Copy `.env.example` to `.env.local` and fill values as you go.

```bash
cp .env.example .env.local
```

---

## 1. Supabase — auth + database (unlocks real logins & data)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, paste and run
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
3. In **Project Settings → API**, copy these into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep secret — server only)
4. Add your own email to `OPERATOR_EMAILS` so you can use the admin panel.
5. (Optional) Seed a demo client with data:
   ```bash
   npm run seed
   # → creates "Riverside Arts Collective" + an owner login it prints out
   ```
6. Restart `npm run dev`. Demo mode is now off:
   - `/login` does real password sign-in.
   - `/admin` is your operator panel (create clients, add deliverables,
     calendar items, and invoices).
   - Clients sign in and see only their own org (enforced by RLS + role guards).

**How data gets in:** use `/admin` to create a client — it provisions their
owner login and lets you manage their deliverables, calendar, and invoices.

---

## 2. Meta — Instagram insights (read-only)

> This one is gated by Meta's review process, which takes time and is outside
> your control. Start it early.

1. Create an app at [developers.facebook.com](https://developers.facebook.com).
2. Add the **Instagram Graph API** product. Your clients' accounts must be
   Instagram **Business/Creator** accounts linked to a Facebook Page.
3. Add the OAuth redirect URL: `https://YOUR_DOMAIN/api/instagram/callback`.
4. Put credentials in `.env.local`: `META_APP_ID`, `META_APP_SECRET`.
5. Generate a token-encryption key and set `TOKEN_ENCRYPTION_KEY`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
6. Submit for **App Review / Business Verification** to request the read-only
   scopes (`instagram_basic`, `instagram_manage_insights`, `pages_show_list`,
   `pages_read_engagement`). Until approved, only test users work.

We only ever request read-only scopes and never act on a client's account.

---

## 3. Stripe — billing

1. Create an account at [stripe.com](https://stripe.com).
2. Copy your secret key into `STRIPE_SECRET_KEY` (use a test key first).
3. Create a webhook endpoint pointing at
   `https://YOUR_DOMAIN/api/stripe/webhook`, subscribed to
   `checkout.session.completed`. Copy its signing secret into
   `STRIPE_WEBHOOK_SECRET`.
4. Owners can now pay open invoices from **Dashboard → Invoices**; paid status
   updates automatically via the webhook.

Local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 4. Contact form delivery (optional)

The intro-call form logs submissions and appends them to `.data/` locally. To
get emailed, wire the `deliver()` function in
[`src/app/api/contact/route.ts`](src/app/api/contact/route.ts) to a provider
such as Resend.

---

## 5. Deploy (Vercel)

1. Push this repo to GitHub and import it at [vercel.com](https://vercel.com).
2. Add every variable from `.env.local` to the Vercel project's Environment
   Variables, and set `NEXT_PUBLIC_SITE_URL` to your production URL.
3. Deploy. Update the Meta redirect URL and Stripe webhook URL to the
   production domain.

---

## Before real launch — checklist

- [ ] Have `Privacy` and `Terms` reviewed by counsel (Meta review requires a
      privacy policy URL).
- [ ] Set `TOKEN_ENCRYPTION_KEY` before storing any real Instagram tokens.
- [ ] Test the full flow with test keys: create a client in `/admin`, sign in as
      that owner, connect a test Instagram account, pay a test invoice.
- [ ] Swap real case studies into `src/content/case-studies.ts`.
