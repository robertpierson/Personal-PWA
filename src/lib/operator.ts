import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, isOperatorEmail } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OperatorContext = { email: string; demo: boolean };

/**
 * Resolves the operator (agency) context for the admin panel. In demo mode the
 * panel is open but read-only. With Supabase configured, the signed-in user's
 * email must be in OPERATOR_EMAILS.
 */
export async function getOperator(): Promise<OperatorContext | null> {
  if (!isSupabaseConfigured) return { email: "demo@operator", demo: true };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isOperatorEmail(user.email)) return null;
  return { email: user.email!, demo: false };
}

export async function requireOperator(): Promise<OperatorContext> {
  const op = await getOperator();
  if (!op) redirect("/login");
  return op;
}
