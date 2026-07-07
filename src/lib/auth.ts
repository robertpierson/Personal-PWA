import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEMO_ORG_OVERRIDE_COOKIE,
  DEMO_SESSION_COOKIE,
  isSupabaseConfigured,
} from "@/lib/config";
import { demoSession } from "@/lib/demo/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardSession, Org, Role } from "@/lib/types";

/**
 * Resolves the current dashboard session. In demo mode this is driven by a
 * simple cookie; with Supabase configured it reads the authenticated user and
 * their single org membership (one org per account — see the schema).
 */
export async function getSession(): Promise<DashboardSession | null> {
  if (!isSupabaseConfigured) {
    const store = await cookies();
    const demo = store.get(DEMO_SESSION_COOKIE);
    if (!demo) return null;
    const session = demoSession(demo.value === "worker" ? "worker" : "owner");

    const override = store.get(DEMO_ORG_OVERRIDE_COOKIE);
    if (override) {
      try {
        const { name, type } = JSON.parse(override.value) as {
          name?: string;
          type?: string;
        };
        session.org = { ...session.org, name: name || session.org.name, type: type || session.org.type };
      } catch {
        // ignore a malformed cookie
      }
    }
    return session;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("org_members")
    .select("id, role, orgs(id, name, slug, type, plan)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership || !membership.orgs) return null;

  const org = membership.orgs as unknown as Org;
  return {
    org,
    member: {
      id: membership.id as string,
      orgId: org.id,
      name: (user.user_metadata?.name as string) ?? user.email ?? "Member",
      email: user.email ?? "",
      role: membership.role as Role,
    },
    demo: false,
  };
}

/** Session or bust — redirects unauthenticated visitors to the login page. */
export async function requireSession(): Promise<DashboardSession> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
