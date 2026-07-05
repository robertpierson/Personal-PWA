"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/operator";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/** Guard: operator + live Supabase. Returns the admin client or null (demo). */
async function operatorClient() {
  const op = await requireOperator();
  if (op.demo) return null; // writes disabled in demo mode
  return createSupabaseAdminClient();
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function createOrg(formData: FormData) {
  const supabase = await operatorClient();
  if (!supabase) return;

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "Community organization").trim();
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();
  const ownerPassword = String(formData.get("ownerPassword") ?? "");
  if (!name || !ownerEmail || ownerPassword.length < 8) return;

  // Create the owner auth user (email pre-confirmed so they can sign in).
  const { data: created, error: userErr } = await supabase.auth.admin.createUser(
    {
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
      user_metadata: { name: ownerEmail.split("@")[0] },
    },
  );
  if (userErr || !created.user) return;

  const { data: org, error: orgErr } = await supabase
    .from("orgs")
    .insert({ name, slug: slugify(name), type })
    .select("id")
    .single();
  if (orgErr || !org) return;

  await supabase
    .from("org_members")
    .insert({ org_id: org.id, user_id: created.user.id, role: "owner" });

  revalidatePath("/admin");
  redirect(`/admin/orgs/${org.id}`);
}

export async function createDeliverable(orgId: string, formData: FormData) {
  const supabase = await operatorClient();
  if (!supabase) return;
  await supabase.from("deliverables").insert({
    org_id: orgId,
    title: String(formData.get("title") ?? "").trim(),
    type: String(formData.get("type") ?? "Design").trim(),
    status: String(formData.get("status") ?? "not_started"),
    due_date: String(formData.get("dueDate") ?? new Date().toISOString().slice(0, 10)),
    description: String(formData.get("description") ?? "").trim(),
  });
  revalidatePath(`/admin/orgs/${orgId}`);
}

export async function setDeliverableStatus(
  orgId: string,
  id: string,
  formData: FormData,
) {
  const supabase = await operatorClient();
  if (!supabase) return;
  await supabase
    .from("deliverables")
    .update({ status: String(formData.get("status")) })
    .eq("id", id)
    .eq("org_id", orgId);
  revalidatePath(`/admin/orgs/${orgId}`);
}

export async function deleteDeliverable(orgId: string, id: string) {
  const supabase = await operatorClient();
  if (!supabase) return;
  await supabase.from("deliverables").delete().eq("id", id).eq("org_id", orgId);
  revalidatePath(`/admin/orgs/${orgId}`);
}

export async function createCalendarItem(orgId: string, formData: FormData) {
  const supabase = await operatorClient();
  if (!supabase) return;
  await supabase.from("calendar_items").insert({
    org_id: orgId,
    date: String(formData.get("date") ?? new Date().toISOString().slice(0, 10)),
    title: String(formData.get("title") ?? "").trim(),
    channel: String(formData.get("channel") ?? "instagram"),
    format: String(formData.get("format") ?? "post"),
    status: String(formData.get("status") ?? "idea"),
    caption: String(formData.get("caption") ?? "").trim(),
  });
  revalidatePath(`/admin/orgs/${orgId}`);
}

export async function deleteCalendarItem(orgId: string, id: string) {
  const supabase = await operatorClient();
  if (!supabase) return;
  await supabase.from("calendar_items").delete().eq("id", id).eq("org_id", orgId);
  revalidatePath(`/admin/orgs/${orgId}`);
}

export async function createInvoice(orgId: string, formData: FormData) {
  const supabase = await operatorClient();
  if (!supabase) return;
  const dollars = Number(formData.get("amount") ?? 0);
  await supabase.from("invoices").insert({
    org_id: orgId,
    number: String(formData.get("number") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    amount_cents: Math.round(dollars * 100),
    currency: "usd",
    status: String(formData.get("status") ?? "open"),
    due_date: String(formData.get("dueDate") ?? new Date().toISOString().slice(0, 10)),
  });
  revalidatePath(`/admin/orgs/${orgId}`);
}

export async function deleteInvoice(orgId: string, id: string) {
  const supabase = await operatorClient();
  if (!supabase) return;
  await supabase.from("invoices").delete().eq("id", id).eq("org_id", orgId);
  revalidatePath(`/admin/orgs/${orgId}`);
}
