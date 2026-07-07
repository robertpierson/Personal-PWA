/**
 * Compatibility re-export. The actual content lives in
 * `src/content/site.config.ts` (the single source of truth per the
 * conversion-rebuild brief) — this file exists only so the many components
 * that already import `{ site, nav, orgTypes, audiences }` from `@/lib/site`
 * keep working unchanged. New code should import from `@/content/site.config`
 * directly.
 */
import { brand, nav as navConfig, icp } from "@/content/site.config";

export const site = {
  name: brand.name,
  wordmark: brand.wordmark,
  tagline: brand.tagline,
  positioning: brand.positioning,
  description: brand.description,
  contactEmail: brand.contactEmail,
  url: brand.url,
} as const;

export const nav = navConfig;
export const orgTypes = icp.orgTypes;
export const audiences = icp.audiences;
