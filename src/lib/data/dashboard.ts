import "server-only";
import {
  demoCalendar,
  demoDeliverables,
  demoDesigns,
  demoInsights,
  demoInvoices,
  demoNotifications,
} from "@/lib/demo/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  CREDIT_COSTS,
  creditsForPlan,
  usageBreakdownForPlan,
  type CreditBreakdownItem,
} from "@/content/credits";
import type {
  CalendarItem,
  Deliverable,
  Design,
  DashboardSession,
  Insights,
  Invoice,
  Notification,
  PlanName,
} from "@/lib/types";

/*
 * Read-only data access for the dashboard. Each function returns bundled demo
 * data in demo mode; otherwise it queries Supabase scoped to the session's org
 * (row-level security enforces isolation server-side as a second guard).
 */

export async function getDeliverables(
  session: DashboardSession,
): Promise<Deliverable[]> {
  if (session.demo) return demoDeliverables;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("deliverables")
    .select("id, title, type, status, due_date, description")
    .eq("org_id", session.org.id)
    .order("due_date", { ascending: true });
  return (data ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    type: d.type,
    status: d.status,
    dueDate: d.due_date,
    description: d.description ?? "",
  }));
}

export async function getCalendar(
  session: DashboardSession,
): Promise<CalendarItem[]> {
  if (session.demo) return demoCalendar;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("calendar_items")
    .select("id, date, title, channel, format, status, caption")
    .eq("org_id", session.org.id)
    .order("date", { ascending: true });
  return (data ?? []).map((c) => ({
    id: c.id,
    date: c.date,
    title: c.title,
    channel: c.channel,
    format: c.format,
    status: c.status,
    caption: c.caption ?? "",
  }));
}

export async function getDesigns(session: DashboardSession): Promise<Design[]> {
  if (session.demo) return demoDesigns;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("designs")
    .select("id, title, type, status, created_at, file_url, accent")
    .eq("org_id", session.org.id)
    .order("created_at", { ascending: false });
  return (data ?? []).map((g) => ({
    id: g.id,
    title: g.title,
    type: g.type,
    status: g.status,
    createdAt: g.created_at,
    fileUrl: g.file_url,
    accent: g.accent ?? "forest",
  }));
}

export async function getInvoices(
  session: DashboardSession,
): Promise<Invoice[]> {
  if (session.demo) return demoInvoices;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("invoices")
    .select(
      "id, number, description, amount_cents, currency, status, issued_date, due_date, hosted_url",
    )
    .eq("org_id", session.org.id)
    .order("issued_date", { ascending: false });
  return (data ?? []).map((i) => ({
    id: i.id,
    number: i.number,
    description: i.description ?? "",
    amountCents: i.amount_cents,
    currency: i.currency ?? "usd",
    status: i.status,
    issuedDate: i.issued_date,
    dueDate: i.due_date,
    hostedUrl: i.hosted_url,
  }));
}

export async function getInsights(
  session: DashboardSession,
): Promise<Insights> {
  if (session.demo) return demoInsights;
  const supabase = await createSupabaseServerClient();

  const { data: conn } = await supabase
    .from("instagram_connections")
    .select("username, connected_at, followers_count")
    .eq("org_id", session.org.id)
    .maybeSingle();

  if (!conn) return { connection: null, series: [] };

  const { data: series } = await supabase
    .from("instagram_metrics")
    .select("date, reach, engagement_rate, followers, profile_views")
    .eq("org_id", session.org.id)
    .order("date", { ascending: true });

  return {
    connection: {
      username: conn.username,
      connectedAt: conn.connected_at,
      followersCount: conn.followers_count,
    },
    series: (series ?? []).map((s) => ({
      date: s.date,
      reach: s.reach,
      engagementRate: s.engagement_rate,
      followers: s.followers,
      profileViews: s.profile_views,
    })),
  };
}

export async function getNotifications(
  session: DashboardSession,
): Promise<Notification[]> {
  if (session.demo) return demoNotifications;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, category, title, body, href, created_at, read")
    .eq("org_id", session.org.id)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []).map((n) => ({
    id: n.id,
    category: n.category,
    title: n.title,
    body: n.body,
    href: n.href,
    createdAt: n.created_at,
    read: n.read,
  }));
}

export type CreditsSummary = {
  plan: PlanName;
  totalCredits: number;
  usedCredits: number;
  breakdown: CreditBreakdownItem[];
  /** ISO date the credit cycle resets (start of next calendar month). */
  periodEnd: string;
};

/**
 * Monthly credit usage, translated 1:1 from the org's plan (see
 * src/content/credits.ts) plus real activity this cycle: post-design
 * credits are counted from calendar items actually committed to (scheduled,
 * approved, or published — not bare ideas/drafts), and the plan's other
 * ongoing services (website hosting, calendar management, etc.) are counted
 * as consumed in proportion to how far through the billing month we are.
 */
export async function getCreditsUsage(
  session: DashboardSession,
): Promise<CreditsSummary> {
  const plan = session.org.plan;
  const totalCredits = creditsForPlan(plan);
  const breakdown = usageBreakdownForPlan(plan);

  const calendar = await getCalendar(session);
  const now = new Date();
  const committedPosts = calendar.filter(
    (c) =>
      ["scheduled", "approved", "published"].includes(c.status) &&
      new Date(c.date).getFullYear() === now.getFullYear() &&
      new Date(c.date).getMonth() === now.getMonth(),
  ).length;
  const postCreditsUsed = committedPosts * CREDIT_COSTS.post;

  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const monthProgress = now.getDate() / daysInMonth;
  const flatCredits = breakdown
    .filter((b) => b.key !== "post")
    .reduce((sum, b) => sum + b.credits, 0);
  const flatCreditsUsed = Math.round(flatCredits * monthProgress);

  const usedCredits = Math.min(
    totalCredits,
    postCreditsUsed + flatCreditsUsed,
  );

  const periodEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  ).toISOString();

  return { plan, totalCredits, usedCredits, breakdown, periodEnd };
}
