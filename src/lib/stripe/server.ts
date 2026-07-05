import "server-only";
import Stripe from "stripe";

/**
 * Lazily-constructed Stripe client. Returns null when Stripe isn't configured
 * so callers can degrade gracefully (demo mode). Uses the SDK's pinned API
 * version by omitting an explicit override.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
  }
  return cached;
}
