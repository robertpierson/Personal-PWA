"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_SESSION_COOKIE, isSupabaseConfigured } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthState = { error?: string };

/** Enter the demo dashboard (no real account). Role toggles owner/worker view. */
export async function enterDemo(role: "owner" | "worker") {
  const store = await cookies();
  store.set(DEMO_SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/dashboard");
}

/** Password sign-in. Falls back to demo when Supabase isn't configured. */
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isSupabaseConfigured) {
    await enterDemo("owner");
    return {};
  }

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signOut() {
  const store = await cookies();
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } else {
    store.delete(DEMO_SESSION_COOKIE);
  }
  redirect("/login");
}
