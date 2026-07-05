import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { isMetaConfigured, isSupabaseConfigured } from "@/lib/config";
import { getAuthUrl } from "@/lib/meta/graph";
import { getSession } from "@/lib/auth";

/**
 * Kicks off the Meta OAuth consent flow (read-only). Requires both a real
 * (Supabase) session and Meta credentials; otherwise it redirects back to the
 * insights page with an explanatory notice (e.g. in demo mode).
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (!isMetaConfigured || !isSupabaseConfigured) {
    return NextResponse.redirect(
      `${origin}/dashboard/insights?notice=setup_required`,
    );
  }

  const state = randomBytes(16).toString("hex");
  const store = await cookies();
  store.set("ig_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const redirectUri = `${origin}/api/instagram/callback`;
  return NextResponse.redirect(getAuthUrl(redirectUri, state));
}
