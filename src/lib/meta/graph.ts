import "server-only";

/**
 * Minimal, read-only Meta Graph API wrapper for Instagram Business insights.
 *
 * Scopes requested are strictly read-only (basic profile + insights). This
 * client never posts, follows, likes, or takes any action on a user's account —
 * a hard product rule. See CLAUDE.md.
 */

const GRAPH_VERSION = "v21.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;
const OAUTH_DIALOG = `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`;

// Read-only scopes only.
const SCOPES = [
  "instagram_basic",
  "instagram_manage_insights",
  "pages_show_list",
  "pages_read_engagement",
  "business_management",
].join(",");

export function getAuthUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: redirectUri,
    state,
    scope: SCOPES,
    response_type: "code",
  });
  return `${OAUTH_DIALOG}?${params.toString()}`;
}

async function graphGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${GRAPH}/${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string,
): Promise<string> {
  const data = await graphGet<{ access_token: string }>("oauth/access_token", {
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: redirectUri,
    code,
  });
  return data.access_token;
}

export async function getLongLivedToken(shortToken: string): Promise<string> {
  const data = await graphGet<{ access_token: string }>("oauth/access_token", {
    grant_type: "fb_exchange_token",
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    fb_exchange_token: shortToken,
  });
  return data.access_token;
}

/** Finds the Instagram Business account linked to the user's first Page. */
export async function discoverInstagramAccount(token: string): Promise<{
  igUserId: string;
  username: string;
  followersCount: number;
} | null> {
  const pages = await graphGet<{ data: { id: string }[] }>("me/accounts", {
    access_token: token,
    fields: "id",
  });
  for (const page of pages.data ?? []) {
    const detail = await graphGet<{
      instagram_business_account?: { id: string };
    }>(page.id, {
      access_token: token,
      fields: "instagram_business_account",
    });
    const igId = detail.instagram_business_account?.id;
    if (!igId) continue;
    const profile = await graphGet<{
      username: string;
      followers_count: number;
    }>(igId, {
      access_token: token,
      fields: "username,followers_count",
    });
    return {
      igUserId: igId,
      username: profile.username,
      followersCount: profile.followers_count,
    };
  }
  return null;
}

/** Reads a current snapshot of reach + profile views for the account. */
export async function fetchInsightSnapshot(
  igUserId: string,
  token: string,
): Promise<{ reach: number; profileViews: number }> {
  const data = await graphGet<{
    data: { name: string; values: { value: number }[] }[];
  }>(`${igUserId}/insights`, {
    access_token: token,
    metric: "reach,profile_views",
    period: "week",
  });
  const byName = (name: string) =>
    data.data.find((d) => d.name === name)?.values?.[0]?.value ?? 0;
  return { reach: byName("reach"), profileViews: byName("profile_views") };
}
