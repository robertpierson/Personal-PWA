/**
 * Seeds a live Supabase project with one demo client (org + owner login + a
 * starter set of deliverables, calendar items, designs, invoices, and Instagram
 * metrics). Safe to run once after applying supabase/migrations/0001_init.sql.
 *
 * Usage:
 *   node scripts/seed.mjs [ownerEmail] [ownerPassword]
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, read from
 * .env.local (or the environment).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Minimal .env.local loader (no dependency).
try {
  const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local — rely on process.env */
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local.",
  );
  process.exit(1);
}

const ownerEmail = process.argv[2] ?? "owner@riversidearts.org";
const ownerPassword = process.argv[3] ?? "meridian-demo-1234";

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DAY = 86_400_000;
const iso = (days) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);

async function main() {
  console.log("Creating owner user:", ownerEmail);
  const { data: created, error: userErr } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password: ownerPassword,
    email_confirm: true,
    user_metadata: { name: "Jane Rivera" },
  });
  if (userErr && !String(userErr.message).includes("already")) throw userErr;
  const userId =
    created?.user?.id ??
    (await supabase.auth.admin.listUsers()).data.users.find(
      (u) => u.email === ownerEmail,
    )?.id;
  if (!userId) throw new Error("Could not resolve owner user id.");

  const { data: org, error: orgErr } = await supabase
    .from("orgs")
    .insert({
      name: "Riverside Arts Collective",
      slug: "riverside-arts",
      type: "Community nonprofit",
    })
    .select("id")
    .single();
  if (orgErr) throw orgErr;
  const orgId = org.id;

  await supabase
    .from("org_members")
    .insert({ org_id: orgId, user_id: userId, role: "owner" });

  await supabase.from("deliverables").insert([
    { org_id: orgId, title: "Brand identity system", type: "Design", status: "delivered", due_date: iso(-24), description: "Logo, color, and type with usage guidelines." },
    { org_id: orgId, title: "Q3 content calendar", type: "Strategy", status: "in_review", due_date: iso(3), description: "Twelve weeks mapped to summer programming." },
    { org_id: orgId, title: "Summer gala announcement set", type: "Design", status: "in_progress", due_date: iso(9), description: "Carousel, story set, sponsor one-pager." },
  ]);

  await supabase.from("calendar_items").insert([
    { org_id: orgId, date: iso(1), title: "Gala save-the-date", channel: "instagram", format: "post", status: "approved", caption: "Our annual gala returns this fall." },
    { org_id: orgId, date: iso(2), title: "Behind-the-scenes reel", channel: "instagram", format: "reel", status: "scheduled", caption: "Inside a week of rehearsals." },
    { org_id: orgId, date: iso(6), title: "July newsletter", channel: "newsletter", format: "email", status: "drafting", caption: "Monthly roundup." },
  ]);

  await supabase.from("designs").insert([
    { org_id: orgId, title: "Primary logo lockup", type: "Identity", status: "delivered", accent: "forest" },
    { org_id: orgId, title: "Event announcement template", type: "Template", status: "delivered", accent: "gold" },
    { org_id: orgId, title: "Gala carousel — draft", type: "Campaign", status: "in_progress", accent: "ink" },
  ]);

  await supabase.from("invoices").insert([
    { org_id: orgId, number: "MER-2026-018", description: "Brand identity system", amount_cents: 250000, currency: "usd", status: "paid", issued_date: iso(-28), due_date: iso(-14) },
    { org_id: orgId, number: "MER-2026-021", description: "Monthly retainer — July", amount_cents: 120000, currency: "usd", status: "open", issued_date: iso(-4), due_date: iso(10) },
  ]);

  const metrics = [];
  let followers = 1420;
  for (let w = 11; w >= 0; w--) {
    const t = 11 - w;
    followers += 28 + t;
    metrics.push({
      org_id: orgId,
      date: iso(-w * 7),
      reach: 2600 + t * 340,
      engagement_rate: Number((3.4 + t * 0.24).toFixed(1)),
      followers,
      profile_views: 210 + t * 26,
    });
  }
  await supabase.from("instagram_metrics").insert(metrics);
  await supabase.from("instagram_connections").insert({
    org_id: orgId,
    ig_user_id: "demo",
    username: "riversidearts",
    followers_count: followers,
    connected_at: iso(-84),
  });

  console.log("\n✓ Seed complete.");
  console.log("  Org:", orgId);
  console.log("  Owner login:", ownerEmail, "/", ownerPassword);
  console.log("  Sign in at /login\n");
}

main().catch((err) => {
  console.error("Seed failed:", err.message ?? err);
  process.exit(1);
});
