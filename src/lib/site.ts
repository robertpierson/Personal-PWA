/**
 * Central site configuration. Swap these values (name, contact, links) once the
 * real brand is chosen — nothing else in the marketing site hard-codes them.
 */

export const site = {
  name: "Meridian",
  wordmark: "Meridian",
  tagline: "Local Presence Studio",
  positioning:
    "We make community organizations look as serious as the work they do.",
  description:
    "Meridian is a studio that gives nonprofits, community groups, and local businesses a professional public presence — branded design, a real content calendar, and honest Instagram insights. No bots. No follow-for-follow. Just organizations that look the way they deserve to.",
  // Where to send/receive intro-call requests (wire to email/CRM at deploy time).
  contactEmail: "hello@meridian.studio",
  // Canonical URL — overridden by NEXT_PUBLIC_SITE_URL in production.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Approach", href: "/#approach" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
] as const;

/** Audiences we serve — used in the hero marquee and positioning strip. */
export const audiences = [
  "PTA & school foundations",
  "Youth sports leagues",
  "Local nonprofits",
  "Community theaters",
  "Neighborhood associations",
  "Environmental groups",
  "Food banks & pantries",
  "Historical societies",
  "Small local businesses",
  "Volunteer coalitions",
] as const;
