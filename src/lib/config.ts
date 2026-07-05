/**
 * Feature/integration flags derived from environment. When a service isn't
 * configured, the app falls back to demo mode so the full experience is still
 * viewable locally. Drop real keys into .env to switch each integration live.
 * See .env.example for the full list.
 */

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export const isMetaConfigured = Boolean(
  process.env.META_APP_ID && process.env.META_APP_SECRET,
);

/** Service-role key enables operator writes (admin panel, seeding). */
export const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

/** Secret used to encrypt stored third-party tokens at rest. */
export const isEncryptionConfigured = Boolean(process.env.TOKEN_ENCRYPTION_KEY);

/** When true, the whole app runs on bundled demo data (no external services). */
export const isDemoMode = !isSupabaseConfigured;

/** Cookie set when a visitor enters the demo dashboard without real auth. */
export const DEMO_SESSION_COOKIE = "meridian_demo_session";

/** Emails allowed into the operator admin panel (comma-separated env). */
export const operatorEmails = (process.env.OPERATOR_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isOperatorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return operatorEmails.includes(email.toLowerCase());
}
