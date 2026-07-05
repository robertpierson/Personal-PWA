import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/config";
import {
  demoCalendar,
  demoDeliverables,
  demoInvoices,
  demoOrg,
} from "@/lib/demo/data";
import type {
  CalendarItem,
  Deliverable,
  Invoice,
  Org,
} from "@/lib/types";

/** Orgs across all clients (operator view). */
export async function adminListOrgs(): Promise<
  (Org & { ownerEmail: string | null; memberCount: number })[]
> {
  if (!isSupabaseConfigured) {
    return [
      {
        ...demoOrg,
        ownerEmail: "jane@riversidearts.org",
        memberCount: 2,
      },
    ];
  }
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data: orgs } = await supabase
    .from("orgs")
    .select("id, name, slug, type")
    .order("created_at", { ascending: false });

  const result = [];
  for (const org of orgs ?? []) {
    const { data: members } = await supabase
      .from("org_members")
      .select("role, user_id")
      .eq("org_id", org.id);
    const ownerId = members?.find((m) => m.role === "owner")?.user_id;
    let ownerEmail: string | null = null;
    if (ownerId) {
      const { data: authUser } = await supabase.auth.admin.getUserById(ownerId);
      ownerEmail = authUser?.user?.email ?? null;
    }
    result.push({
      ...(org as Org),
      ownerEmail,
      memberCount: members?.length ?? 0,
    });
  }
  return result;
}

export async function adminGetOrg(id: string): Promise<Org | null> {
  if (!isSupabaseConfigured) return id === demoOrg.id ? demoOrg : null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("orgs")
    .select("id, name, slug, type")
    .eq("id", id)
    .maybeSingle();
  return (data as Org) ?? null;
}

export async function adminGetDeliverables(
  orgId: string,
): Promise<Deliverable[]> {
  if (!isSupabaseConfigured) return demoDeliverables;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("deliverables")
    .select("id, title, type, status, due_date, description")
    .eq("org_id", orgId)
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

export async function adminGetCalendar(orgId: string): Promise<CalendarItem[]> {
  if (!isSupabaseConfigured) return demoCalendar;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("calendar_items")
    .select("id, date, title, channel, format, status, caption")
    .eq("org_id", orgId)
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

export async function adminGetInvoices(orgId: string): Promise<Invoice[]> {
  if (!isSupabaseConfigured) return demoInvoices;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("invoices")
    .select(
      "id, number, description, amount_cents, currency, status, issued_date, due_date, hosted_url",
    )
    .eq("org_id", orgId)
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
