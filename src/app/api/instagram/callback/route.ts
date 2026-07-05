import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isMetaConfigured, isSupabaseConfigured } from "@/lib/config";
import { getSession } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  discoverInstagramAccount,
  exchangeCodeForToken,
  fetchInsightSnapshot,
  getLongLivedToken,
} from "@/lib/meta/graph";
import { encryptSecret } from "@/lib/crypto";

/**
 * Handles the Meta OAuth redirect: validates state, exchanges the code for a
 * long-lived token, discovers the linked Instagram Business account, stores the
 * connection + an initial metric snapshot, then returns to the insights page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const insights = `${origin}/dashboard/insights`;

  if (!isMetaConfigured || !isSupabaseConfigured) {
    return NextResponse.redirect(`${insights}?notice=setup_required`);
  }

  const session = await getSession();
  if (!session) return NextResponse.redirect(`${origin}/login`);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get("ig_oauth_state")?.value;
  store.delete("ig_oauth_state");

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(`${insights}?notice=connect_failed`);
  }

  try {
    const redirectUri = `${origin}/api/instagram/callback`;
    const shortToken = await exchangeCodeForToken(code, redirectUri);
    const longToken = await getLongLivedToken(shortToken);
    const account = await discoverInstagramAccount(longToken);

    if (!account) {
      return NextResponse.redirect(`${insights}?notice=no_ig_account`);
    }

    const snapshot = await fetchInsightSnapshot(account.igUserId, longToken);
    const supabase = await createSupabaseServerClient();
    const today = new Date().toISOString().slice(0, 10);

    await supabase.from("instagram_connections").upsert(
      {
        org_id: session.org.id,
        ig_user_id: account.igUserId,
        username: account.username,
        followers_count: account.followersCount,
        access_token: encryptSecret(longToken), // encrypted at rest
        connected_at: new Date().toISOString(),
      },
      { onConflict: "org_id" },
    );

    await supabase.from("instagram_metrics").upsert(
      {
        org_id: session.org.id,
        date: today,
        reach: snapshot.reach,
        engagement_rate: 0,
        followers: account.followersCount,
        profile_views: snapshot.profileViews,
      },
      { onConflict: "org_id,date" },
    );

    return NextResponse.redirect(`${insights}?notice=connected`);
  } catch (err) {
    console.error("[instagram callback]", err);
    return NextResponse.redirect(`${insights}?notice=connect_failed`);
  }
}
