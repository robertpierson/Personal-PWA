"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requireSession } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_ORG_OVERRIDE_COOKIE } from "@/lib/config";

export type OrgSettingsState = { error?: string; saved?: boolean };

/** Owner-only: update the org's display name and type. */
export async function updateOrgSettings(
  _prev: OrgSettingsState,
  formData: FormData,
): Promise<OrgSettingsState> {
  const session = await requireSession();
  if (session.member.role !== "owner") {
    return { error: "Only an account owner can update organization settings." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  if (!name) return { error: "Organization name can't be empty." };
  if (!type) return { error: "Please choose an organization type." };

  if (session.demo) {
    // No database in demo mode — store the edit in a cookie so the change
    // still feels real when browsing the demo dashboard.
    const store = await cookies();
    store.set(DEMO_ORG_OVERRIDE_COOKIE, JSON.stringify({ name, type }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    revalidatePath("/dashboard", "layout");
    return { saved: true };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("orgs")
    .update({ name, type })
    .eq("id", session.org.id);

  if (error) return { error: "Couldn't save those changes. Please try again." };

  revalidatePath("/dashboard", "layout");
  return { saved: true };
}

/** Marks a single notification as read. No-op in demo mode (static data). */
export async function markNotificationRead(id: string) {
  const session = await requireSession();
  if (session.demo) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from("notifications").update({ read: true }).eq("id", id);
  revalidatePath("/dashboard", "layout");
}

/** Marks every notification as read for the current org. */
export async function markAllNotificationsRead() {
  const session = await requireSession();
  if (session.demo) return;
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("org_id", session.org.id)
    .eq("read", false);
  revalidatePath("/dashboard", "layout");
}
