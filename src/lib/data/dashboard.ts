import "server-only";
import {
  demoCalendar,
  demoDeliverables,
  demoDesigns,
  demoInsights,
  demoInvoices,
} from "@/lib/demo/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CalendarItem,
  Deliverable,
  Design,
  DashboardSession,
  Insights,
  Invoice,
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
